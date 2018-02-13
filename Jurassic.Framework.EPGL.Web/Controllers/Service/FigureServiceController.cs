using Jurassic.AppCenter;
using Jurassic.EPGL.DataService.Service;
using Jurassic.PKS.Service;
using Jurassic.So.Business;
using Jurassic.WebFrame;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers.Service
{
    public class FigureServiceController : BaseController
    {
        MongoDBQueryService queryService = new MongoDBQueryService();
        /// <summary>
        /// 构造函数
        /// </summary>
        public FigureServiceController()
        {
            new KMD();
        }

        /// <summary>
        /// 从bank来的信息
        /// </summary> 
        public ActionResult GetSubmissionInfo()
        {
            var userName = User.Identity.Name; 
            var obj = queryService.GetMany(userName);
            return Json(obj);
        }

        /// <summary>
        /// 获取元数据标签
        /// </summary> 
        public ActionResult GetMetadataDefintion()
        {
            var url = Server.MapPath("~/App_Data/MetadataDefinition.json");
            var json = System.IO.File.ReadAllText(url, Encoding.Default);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 图件上传
        /// </summary>
        public JsonResult FigureUpload()
        {
            var file = HttpContext.Request.Files["file-input"];
            var fileId = queryService.Upload(file.FileName, file.InputStream);
            var tempPath = "\\TempUpload\\";
            string path = System.Web.HttpContext.Current.Server.MapPath(tempPath);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            var fileUrl = path + file.FileName;
            file.SaveAs(fileUrl);
            file.InputStream.Close();
            return Json(new { fileId = fileId, path = tempPath + file.FileName });
        }

        /// <summary>
        /// 提交文件元数据到bank
        /// </summary>
        public JsonResult BatchOne(string metadata, string fileId, string filePath)
        {
            if (string.IsNullOrEmpty(fileId)) return Json("error");
            var fileIds = new List<string>();
            fileIds.Add(fileId);
            var submissionInfo = new GbSubmissionInfo
            {
                FileIDs = fileIds,
                Action = GbSubmissionAction.Create,
                Option = new GbSubmissionOption
                {
                    Application = "EPGL",
                    Authentic = false,
                    UploadedBy = User.Identity.Name,
                    AutoComplement = false,
                    Task = "Manager",
                    UploadedDate = DateTime.Now,
                }
            };
            var kmd = BuildProductKmd(metadata, filePath);
            submissionInfo.KMD = JsonHelper.FromJson<KMDMetadata>(kmd.ToString());
            string resultId = queryService.SubmitAsync(submissionInfo);
            if (!string.IsNullOrEmpty(resultId)) return Json("success");
            return Json("error");
        }

        /// <summary>
        /// 更新文件元数据到bank
        /// </summary>
        public JsonResult ReplaceOne(string iiid, string metadata)
        {
            var submissionInfo = new GbSubmissionInfo
            {
                Option = new GbSubmissionOption { }
            };
            var kmd = BuildProductKmd(metadata);
            submissionInfo.KMD = JsonHelper.FromJson<KMDMetadata>(kmd.ToString());
            queryService.ReplaceOne(iiid, submissionInfo);
            return Json("");
        }

        /// <summary>
        /// 删除文件元数据
        /// </summary>
        public JsonResult DeteleOne(string iiid)
        {
            queryService.DeteleOne(iiid);
            return Json("");
        }

        private object BuildProductKmd(string metadata, string filePath = "")
        {
            var kmd = new JsonMetadata();
            JObject _jObject = JObject.Parse(metadata);
            foreach (var item in _jObject)
            {
                kmd.SetValue(item.Key, item.Value.ToString());
            }
            if (!string.IsNullOrEmpty(filePath)) kmd.SetValue("Thumbnail", GetThumbnail(filePath));
            return kmd;
        }

        /// <summary>
        /// 审核，提交元数据到索引
        /// </summary>
        public void AuthenticOne(string natureKey)
        {
            SendIndexing(natureKey);
        }

        /// <summary>
        /// 批量审核
        /// </summary>
        public void AuthenticList(string natureKeys)
        {
            var temp = natureKeys.Split(',');
            for (var i = 0; i < temp.Length; i++)
            {
                var natureKey = temp[i];
                SendIndexing(natureKey);
            }
        }

        private void SendIndexing(string natureKey)
        {
            var archiveMetadata = queryService.Get(natureKey) as ArchiveMetadata;
            if (archiveMetadata == null) return;
            var submissionInfo = new GbSubmissionInfo
            {
                NatureKey = natureKey,
                FileIDs = archiveMetadata.FileIDs,
                Action = GbSubmissionAction.Create,
                KMD = archiveMetadata.KMD,
                Option = new GbSubmissionOption
                {
                    Application = "EPGL",
                    Authentic = true,
                    AutoComplement = false,
                    Task = "Manager",
                    UploadedDate = archiveMetadata.Option.UploadedDate,
                }
            };
            if (submissionInfo.KMD.Dc.Contributor == null)
            {
                var contributor = new List<KMDMetadataTypeName>();
                contributor.Add(new KMDMetadataTypeName { Type = "Auditor", Name = User.Identity.Name });
                submissionInfo.KMD.Dc.Contributor = contributor;
            }
            else
            {
                submissionInfo.KMD.Dc.Contributor.Add(new KMDMetadataTypeName { Type = "Auditor", Name = User.Identity.Name });
            }
            //索引库
            queryService.SendIndexing(submissionInfo);
            //成果库
            submissionInfo.KMD.Source = null;
            queryService.AuthenticOne(natureKey, submissionInfo);
        }

        /// <summary>
        /// 获取未审核的记录
        /// </summary>
        public JsonResult GetUnauthenticList()
        {
            var userName = User.Identity.Name;
            var obj = queryService.GetManyAuthentic();
            return Json(obj);
        }

        /// <summary>
        /// 返回缩略图
        /// </summary>
        private string GetThumbnail(string filePath)
        {
            var thumbnail = string.Empty;
            var path = AppDomain.CurrentDomain.BaseDirectory;
            var file = path + filePath;
            using (System.Diagnostics.Process process = new System.Diagnostics.Process())
            {
                try
                {
                    //设置启动动作,确保以管理员身份运行  
                    process.StartInfo.Verb = "runas";
                    process.StartInfo.FileName = string.Format(@"{0}bin\JoWebServiceTest.exe", path);
                    process.StartInfo.Arguments = file;
                    //禁用操作系统外壳程序 
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.CreateNoWindow = true;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.RedirectStandardError = true;
                    process.Start();
                    thumbnail += process.StandardOutput.ReadToEnd();
                }
                catch (Exception err)
                {
                }
                finally
                {
                    process.Close();
                }
            }
            if (!string.IsNullOrEmpty(filePath)) DeleteFigure(file);
            return thumbnail;
        }

        /// <summary>
        /// 删除图件
        /// </summary>
        private void DeleteFigure(string file)
        {
            if (System.IO.File.Exists(file))
            {
                System.IO.File.Delete(file);
            }
        }
    }
}