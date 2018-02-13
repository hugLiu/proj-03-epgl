using Jurassic.Framework.EPGL.Web.Models;
using Jurassic.Framework.EPGL.Web.Utility;
using Jurassic.So.Business;
using Jurassic.So.Infrastructure;
using Jurassic.So.Infrastructure.Util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class WebServiceController : Controller
    {
        // GET: /WebService/
        private readonly string _apiPath = System.Configuration.ConfigurationManager.AppSettings["ApiServiceURL"]
            + System.Configuration.ConfigurationManager.AppSettings["ApiVersion"];
        // GET: /GmsApiService/
        private readonly string gmsApiPath = System.Configuration.ConfigurationManager.AppSettings["GmsApiServiceUrl"]
            + System.Configuration.ConfigurationManager.AppSettings["GmsApiVersion"];

        //搜索服务
        private readonly string _search = System.Configuration.ConfigurationManager.AppSettings["Search"];
        private readonly string _match = System.Configuration.ConfigurationManager.AppSettings["Match"];
        private readonly string _getMetadataDefinition = System.Configuration.ConfigurationManager.AppSettings["GetMetadataDefinition"];
        private readonly string _dataService = System.Configuration.ConfigurationManager.AppSettings["DataService"];
        private readonly string _getData = System.Configuration.ConfigurationManager.AppSettings["GetData"];
        private readonly string _searchService = System.Configuration.ConfigurationManager.AppSettings["SearchService"];
        private readonly string _retrieve = System.Configuration.ConfigurationManager.AppSettings["Retrieve"];
        private readonly string _submitapi = System.Configuration.ConfigurationManager.AppSettings["SubmissionServiceUrl"];
        private readonly string _submit = System.Configuration.ConfigurationManager.AppSettings["Submit"];
        private readonly string _upload = System.Configuration.ConfigurationManager.AppSettings["Upload"];
        private readonly string _getMetaData = System.Configuration.ConfigurationManager.AppSettings["GetMetaData"];

        //GMS获取虚图服务
        private readonly string gmsUpload = System.Configuration.ConfigurationManager.AppSettings["GmsUpload"];
        private readonly string getMap = System.Configuration.ConfigurationManager.AppSettings["GmsGetMap"];

        //对象服务
        private readonly string _boService = System.Configuration.ConfigurationManager.AppSettings["BoService"];
        private readonly string _getBOListByBot = System.Configuration.ConfigurationManager.AppSettings["GetBOListByBot"];
        private readonly string _getBOAliasByID = System.Configuration.ConfigurationManager.AppSettings["GetBOAliasByID"];
        
        /// <summary>
        /// 前端使用的通用方法，只负责调用不负责参数。get参数的post方法。
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult PostFromBody()
        {
            string pram = Request.Form["pram"];
            string url = Request.Form["url"];
            string userToken = TokenManmge.GetTokenService();
            var content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                  {"", pram}
                });
            return Json(WebRequestUtil.PostHttpClientStr(url, content, userToken).GetAwaiter().GetResult(), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 前端使用的通用方法，只负责调用不负责参数。post
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Post()
        {
            string pram = Request.Form["pram"];
            string url = Request.Form["url"];
            string userToken = TokenManmge.GetTokenService();
            //return Json(WebRequestUtil.PostHttpClientStr(url, pram, userToken).GetAwaiter().GetResult(), JsonRequestBehavior.AllowGet);
            return null;
        }

        /// <summary>
        /// 前端使用的通用方法，只负责调用不负责参数。get
        /// </summary>
        /// <param name="pram"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult Get(string pram, string url)
        {
            var parmOdj = JsonConvert.DeserializeObject<Dictionary<string, string>>(pram);
            string userToken = TokenManmge.GetTokenService();
            return Json(WebRequestUtil.GetHttpClientStr(url, parmOdj, userToken).GetAwaiter().GetResult(), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="parmOdj"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public JsonResult Get(Dictionary<string, string> parmOdj, string url)
        {
            //var parmOdj = JsonConvert.DeserializeObject<Dictionary<string, string>>(pram);
            string userToken = TokenManmge.GetTokenService();
            return Json(WebRequestUtil.GetHttpClientStr(url, parmOdj, userToken).GetAwaiter().GetResult(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMetadataDefinition()
        {
            string userToken = TokenManmge.GetTokenService();
            JsonResult json = Json(WebRequestUtil.PostHttpClientStr(_apiPath + _searchService + _getMetadataDefinition, "", userToken).GetAwaiter().GetResult(), JsonRequestBehavior.AllowGet);
            return json;
        }

        public ActionResult GetDataEntity(string urlstr, string ticket, string format, string name = null)
        {
            string userToken = TokenManmge.GetTokenService();
            using (var client = new HttpClientWrapper())
            {
                var url = _apiPath + _dataService + _getData + "?url=" + urlstr + "&ticket=" + ticket;
                //var result = client.Get(url, null, userToken);
                var response = client.Get<HttpResponseMessage>(url, null, userToken);
                var mediaType = response.Content.Headers.ContentType.MediaType;
                var result = response.Content.ReadAsStreamAsync().Result;
                string fileName = null;
                if (name != null)
                    fileName = HttpUtility.UrlEncode(name, Encoding.GetEncoding("UTF-8"));
                return File(result.As<Stream>(), mediaType, fileName + "." + format);
            }
            //return Json(WebRequestUtil.GetHttpClientStr(_apiPath + _dataService + _getData, parmOdj, userToken).GetAwaiter().GetResult(), JsonRequestBehavior.AllowGet);
        }

        public string GetDataEntity2(string urlstr, string ticket, string format, string name = null)
        {
            string userToken = TokenManmge.GetTokenService();
            using (var client = new HttpClientWrapper())
            {
                var url = _apiPath + _dataService + _getData + "?url=" + urlstr + "&ticket=" + ticket; 
                var response = client.Get<HttpResponseMessage>(url, null, userToken);
                var mediaType = response.Content.Headers.ContentType.MediaType;
                var result = response.Content.ReadAsStreamAsync().Result;
                string fileName = null;
                if (name != null)
                    fileName = HttpUtility.UrlEncode(name, Encoding.GetEncoding("UTF-8"));
                var file = File(result.As<Stream>(), mediaType, fileName + "." + format);


                var fileStream = file.FileStream as MemoryStream;
                 
                Byte[] MeaningFile;
                 
                int size = Convert.ToInt32(fileStream.Length);
                MeaningFile = new Byte[size];
                fileStream.Read(MeaningFile, 0, size);
                fileStream.Close();
                FileStream fos = null;
 
                if (format == "gdb" || format == "gdbx")
                {
                    try
                    {
                        string filePath = System.Web.HttpContext.Current.Server.MapPath("/TempGdb/"); //HttpContext.Current.Server.MapPath("/");
                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }
                        fileName = name+ "."+ format;
                        fos = new FileStream(filePath + fileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                        fos.Write(MeaningFile, 0, MeaningFile.Length);
                        fos.Close();
                    }
                    catch(Exception ex)
                    {
                        throw ex;
                    }
                    finally
                    {
                        if (fos != null)
                        {
                            try
                            {
                                fos.Close();
                            }
                            catch (Exception ex)
                            {
                                throw ex;
                            }
                        }
                    }
                }
                var strUrl = "/TempGdb/" + fileName;
                return strUrl;
            }
         }

        public JsonResult GetRetrieve(Dictionary<string, string> parmOdj)
        {
            string userToken = TokenManmge.GetTokenService();
            return Json(WebRequestUtil.GetHttpClientStr(_apiPath + _dataService + _retrieve, parmOdj, userToken).GetAwaiter().GetResult(), JsonRequestBehavior.AllowGet);
        }

        public ContentResult GetMatch(string pramsJson)
        {
            string userToken = TokenManmge.GetTokenService();
            var result = WebRequestUtil.PostHttpClientStr(_apiPath + _searchService + _match, pramsJson, userToken).Result;
            return Content(result, MimeTypeConst.JSON);
            //return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ContentResult GetSearch(string pramsJson)
        {
            string userToken = TokenManmge.GetTokenService();
            var result = WebRequestUtil.PostHttpClientStr(_apiPath + _searchService + _search, pramsJson, userToken).Result;
            return Content(result, MimeTypeConst.JSON);
            //return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ContentResult PostSubmit(string pramsJson)
        {
            string userToken = TokenManmge.GetTokenService();
            var result = WebRequestUtil.PostHttpClientStr(_submitapi + _submit, pramsJson, userToken).Result;
            return Content(result, MimeTypeConst.JSON);
            //return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ContentResult GetMateData(Dictionary<string, string> prams)
        {
            string userToken = TokenManmge.GetTokenService();
            var result = WebRequestUtil.GetHttpClientStr(_apiPath + _searchService + _getMetaData, prams, userToken).Result;
            return Content(result, MimeTypeConst.JSON);
        }

        public ContentResult GetMap(Dictionary<string, string> prams)
        {
            string userToken = TokenManmge.GetTokenService(); 
            var result = WebRequestUtil.GetHttpClientStr(gmsApiPath + gmsUpload + getMap, prams, userToken).Result;
            return Content(result, MimeTypeConst.JSON);
        }

        //public ContentResult GetBOListByBot(string pramsJson)
        //{
        //    string userToken = TokenManmge.GetTokenService();
        //    var result = WebRequestUtil.PostHttpClientStr(_apiPath + _boService + _getBOListByBot, pramsJson, userToken).Result;
        //    return Content(result, MimeTypeConst.JSON);
        //}

        //public ContentResult GetBOAliasByID(string pramsJson)
        //{
        //    string userToken = TokenManmge.GetTokenService();
        //    var result = WebRequestUtil.PostHttpClientStr(_apiPath + _boService + _getBOAliasByID, pramsJson, userToken).Result;
        //    return Content(result, MimeTypeConst.JSON);
        //}
    }
}