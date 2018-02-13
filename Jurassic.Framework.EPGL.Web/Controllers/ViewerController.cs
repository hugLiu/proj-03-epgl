using Jurassic.EPGL.DataService.Models;
using Jurassic.EPGL.DataService.Service;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using System.Dynamic;
using Jurassic.Framework.EPGL.Web.Models;
using System.IO;
using System.Xml;
using Jurassic.Framework.EPGL.Web.Utility;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;
using Jurassic.AppCenter;
using Jurassic.WebFrame;
using Jurassic.EPGL.DataService;
using Jurassic.EPGL.Cache.Redis;
using GGGXParse;
using System.Data;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class ViewerController : BaseController
    {
        /// <summary>
        /// 服务层接口
        /// </summary>
        private IAPPDATAMODELService appDataModelService { get; set; }
        private IJoinTableCommonService joinTableCommonService { get; set; }
        private IThematicMapService thematicMapService { get; set; }
        private IUSERBEHAVIORService userBehaviorService { get; set; }
        private IMiningChartService miningChartService { get; set; }

        private static RedisHelper redis;

        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="_appDataModelService"></param>
        /// <param name="_joinTableCommonService"></param>
        /// <param name="_thematicMapService"></param>
        public ViewerController(IAPPDATAMODELService _appDataModelService, IJoinTableCommonService _joinTableCommonService,
            IThematicMapService _thematicMapService, IUSERBEHAVIORService _userBehaviorService, IMiningChartService _miningChartServ)
        {
            appDataModelService = _appDataModelService;
            joinTableCommonService = _joinTableCommonService;
            thematicMapService = _thematicMapService;
            userBehaviorService = _userBehaviorService;
            miningChartService = _miningChartServ;
            redis = new RedisHelper(RedisConfig.REDISDB_BO);
        }

        // GET: Viewer
        /// <summary>
        /// 图件详情页面
        /// </summary>
        /// <param name="iiid">当前图件的iiid</param>
        /// <param name="data">
        /// 当前结果的iiid集合数据，满足如下格式
        /// var temp = ["",""];   
        /// </param>
        /// <returns></returns> 
        [LoginAuthorize]
        public ActionResult Detail(string iiid, string data)
        {
            ViewBag.MapId = iiid;
            ViewBag.MapData = data;
            return View();
        }

        public ActionResult Updatedetails()
        {
            return View();
        }

        /// <summary>
        /// 获取列名
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        [HttpPost]
        public JsonResult GetDataColumns()
        {
            //系统默认的显示字段
            //var fields = appDataModelService.GetAPPDATAMODELInfo(new APPDATAMODELModel { DATACLASSID = 0 }).GroupBy(a => a.DATACLASSID).OrderBy(b => b.Key);

            var userid = decimal.Parse(CurrentUserId);
            var fields = joinTableCommonService.GetAppDataProfileModel(userid).GroupBy(a => a.DATACLASSID);
            var results = new Dictionary<int, object>();

            
            var classId = 0;
            foreach (var field in fields)
            {
                classId = Convert.ToInt32(field.Key);

                var tempObj = new Object();
                //列名集合
                var columnNames = new ArrayList();
                //列模型
                var columnModel = new ArrayList();
                foreach (var item in field)
                {
                    columnNames.Add(item.CAPTION);

                    var column = new
                    {
                        index = item.KEYINDEX,
                        name = item.KEY,
                        label = item.CAPTION,
                        hidden = item.DEFSHOW == 1 ? false : true,
                        formatter = item.VALFORMAT
                    };
                    columnModel.Add(column);
                }
                tempObj = new
                {
                    colNames = columnNames,
                    colModel = columnModel
                };

                results.Add(classId, tempObj);
            }
            //string json =JsonConvert.SerializeObject(results);
            string json = JsonHelper.ToJson(results);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取钻井等表格数据
        /// </summary>
        /// <param name="typeId"></param>
        /// <returns></returns>
        public JsonResult GetDataByType(int typeId, string boId)
        {
            var list = joinTableCommonService.GetProDataInfo(new ProDataModel { DATACLASSID = typeId, BOID = boId });
            return Json(list, JsonRequestBehavior.AllowGet);

        }

        /// <summary>
        /// 获取钻井等特定boid的表格数据
        /// </summary>
        /// <param name="typeId"></param>
        /// <param name="boId"></param>
        /// <returns></returns>
        public ActionResult GetBoData(int typeId, string boId)
        {
            var fields = appDataModelService.GetAPPDATAMODELInfo(new APPDATAMODELModel { DATACLASSID = typeId });
            var records = joinTableCommonService.GetProDataModelInfo(new ProDataModel { DATACLASSID = typeId, BOID = boId });

            var _fields = new StringBuilder();
            var _records = new StringBuilder();

            System.Web.Script.Serialization.JavaScriptSerializer jss = new System.Web.Script.Serialization.JavaScriptSerializer();
            jss.Serialize(fields, _fields);
            jss.Serialize(records, _records);

            return Content(_fields + "#" + _records);
        }

        /// <summary>
        /// 获取专题图xml
        /// </summary>
        public ActionResult GetThematicMapXml(List<string> boId, string columns, string date, string themeTempletJson)
        {
            var themeTemplet = JsonHelper.FromJson<ThemeTempletModel>(themeTempletJson);
            //专题图样式单xml
            var xmlTheme = thematicMapService.GetThemeTemplet(themeTemplet);
            var tempTheme = "/XMLFile/XMLTheme/" + DateTime.Now.ToString("yyyy-MM-dd") + "/";
            string pathTheme = System.Web.HttpContext.Current.Server.MapPath(tempTheme);
            if (!Directory.Exists(pathTheme))
            {
                Directory.CreateDirectory(pathTheme);
            }
            var nameTheme = Guid.NewGuid() + ".xml";
            var absolutePathTheme = pathTheme + nameTheme;
            xmlTheme.Save(absolutePathTheme);
            var relativeThemePath = tempTheme + nameTheme;

            //专题图数据xml
            var xml = thematicMapService.GetThematicMapXml(string.Join(",", boId), columns, date);
            var temp = "/XMLFile/" + DateTime.Now.ToString("yyyy-MM-dd") + "/";
            string path = System.Web.HttpContext.Current.Server.MapPath(temp);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            var name = Guid.NewGuid() + ".xml";
            var absolutePath = path + name;
            xml.Save(absolutePath);
            var relativePath = temp + name;

            return Json(new { stylePath = relativeThemePath, dataPath = relativePath }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 新增/更新浏览状态
        /// </summary>
        /// <param name="hasUserBehavior"></param>
        /// <param name="iiid"></param>
        /// <param name="metaPT"></param>
        /// <param name="metaTitle"></param>
        /// <param name="metaAuthor"></param>
        /// <param name="metaSourceUrl"></param>
        /// <param name="metaCreateDate"></param>
        /// <param name="metaIndexDate"></param>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult UpdateLook(bool hasUserBehavior, string iiid, string metaPT, string metaTitle, string metaAuthor, string metaSourceUrl, string metaCreateDate, string metaIndexDate)
        {
            var userId = Convert.ToInt32(CurrentUser.Id);

            var lookBehavior = userBehaviorService.GetUserBehaviorByKey(iiid, userId, 1);

            var model = new USERBEHAVIORModel
            {
                IIID = iiid,
                USERID = userId,
                LOOKFLAG = 1,
                LOOKCOUNT = 1,
                LOOKDATE = DateTime.Now,
                STATE = 1
            };
            if (lookBehavior != null)
            {
                model.METAPT = metaPT;
                model.METATITLE = metaTitle;
                model.METAAUTHOR = metaAuthor;
                model.METASOURCEURL = metaSourceUrl;
                model.METADESC = "";
                model.METACREATEDATE = Convert.ToDateTime(metaCreateDate);
                model.METAINDEXDATE = Convert.ToDateTime(metaIndexDate);
                model.FAVORITEFLAG = 0;
                model.FAVCATALOGID = null;
                model.FAVORITEDATE = DateTime.Now;
                model.DOWNLOADFLAG = 0;
                model.DOWNLOADCOUNT = 0;
                model.DOWNLOADDATE = DateTime.Now;

                userBehaviorService.AddUserBehavior(model);
            }
            else
            {
                userBehaviorService.UpdateLookStatus(model);
            }

            return Content("success");
        }

        /// <summary>
        /// 获取采油井开发曲线
        /// </summary>
        /// <param name="startNY"></param>
        /// <param name="endNY"></param>
        /// <returns></returns>
        public JsonResult GetMiningChart(MiningChartModel model)
        {
            var list = miningChartService.GetMingingChartInfo(model);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取开采曲线模型
        /// </summary>
        public JsonResult GetMiningChartModel()
        {
            var fields = appDataModelService.GetAPPDATAMODELInfo(new APPDATAMODELModel { DATACLASSID = 8 }).Where(x => x.DEFSHOW == 1);
            return Json(fields, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ImportTo3GX(string id)
        {
            var gml = LoadImpFileTo3GX("file-input");
            var xml = gml.InnerXml;
            //if (!string.IsNullOrEmpty(xml))
            //{
            //    var ts = new TimeSpan(1, 0, 0, 0);
            //    var key = RedisConfig.GetKEY_ProjectBOResult(id);
            //    redis.StringSet(key, xml, ts);
            //}
            string webdir = "/XMLFile/";
            string path = System.Web.HttpContext.Current.Server.MapPath(webdir);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            var gmlfname = string.Format("{0}.xml", Guid.NewGuid().ToString());
            var gmlsave = path + gmlfname;
            gml.Save(gmlsave);
     
            //return new XmlResult(gml, gml.GetType());
            //return Json(new { xmlfile = webdir + gmlfname });
            //return Json(xml);
            var xmlfile = webdir + gmlfname;
            return Content(xmlfile, "text/html;charset=UTF-8");
        }

        /// <summary>
        /// 声明 HSSFWorkbook 对象
        /// </summary>
        private HSSFWorkbook hssfworkbook;  //是操作Excel2003（包括2003)版本，扩展名是.xls
        private XSSFWorkbook xssfworkbook; //是操作Excel2007版本，扩展名是.xlsx
        private ISheet sheet;
        /// <summary>
        /// 声明 HSSFSheet 对象
        /// </summary>
        //private HSSFSheet _sheet;
        private XmlDocument LoadImpFileTo3GX(string file_input)
        {
            var file = HttpContext.Request.Files[file_input];
            var fileName = file.FileName;

            if (fileName.Contains("xlsx"))
            {
                xssfworkbook = new XSSFWorkbook(file.InputStream);
                sheet = xssfworkbook.GetSheetAt(0);
            }
            else
            {
                hssfworkbook = new HSSFWorkbook(file.InputStream);
                sheet = hssfworkbook.GetSheetAt(0);
            }

            //根据excel构建数据表
            DataTable dt = ConvertToDataTable(fileName);
            List<GeoFeature> ftList = CreateFeatures(dt);
            return ConvertFT.FeatureToGGGX(ftList);
        }

        private List<GeoFeature> CreateFeatures(DataTable dt)
        {
            List<GeoFeature> ftList = new List<GeoFeature>();
            GeoFeature gf = null;
            Geometry geometry = null;
            string GEOMETRYWKT = string.Empty;

            //遍历所有行组织对象 面 线对象会占据多行
            string swapbyname = string.Empty;//以名称区别
            string fname;//以名称区别
            string x, y, z, type;
            //组织目标对象，多行坐标同一目标算作一个目标对象
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                if (i <= 1) continue;//排除第1,2行

                //存储名称 Z / Name 列都可能是对象名称
                fname = dt.Rows[i][2].ToString();//获取 Z
                if (string.IsNullOrEmpty(fname))
                    fname = dt.Rows[i][3].ToString();//获取 Name

                type = dt.Rows[i][4].ToString();//获取 Type

                //收集同一目标对象，实例化GeoFeature
                if (!fname.Equals(swapbyname))//等值 表明当前是同一对象的数据
                {
                    gf = new GeoFeature { BOID = Guid.NewGuid().ToString(), NAME = fname, BOT = GetBOT(type), FT = GetBOT(type) };
                    ftList.Add(gf);
                    swapbyname = fname;
                }
            }

            //遍历重新组织的目标对象集合，提取源数据表里的坐标
            DataRow[] drfind = null;
            foreach (GeoFeature f in ftList)
            {
                //根据目标名称查找坐标数据
                drfind = dt.Select(string.Format("D='{0}'", f.NAME));
                if (drfind == null || drfind.Length == 0) continue;

                f.GeometryList = new List<Geometry>();
                geometry = new Geometry();
                GEOMETRYWKT = string.Empty;
                var wktformat = newWKTFormat(f.FT);
                for (int j = 0; j < drfind.Length; j++)
                {
                    //处理坐标
                    x = drfind[j][0].ToString();//获取 X
                    y = drfind[j][1].ToString();//获取 Y
                    var cx = Math.Round(SpecialTools.ConvertDegreesToDigital(x), 6, MidpointRounding.AwayFromZero);
                    var cy = Math.Round(SpecialTools.ConvertDegreesToDigital(y), 6, MidpointRounding.AwayFromZero);
                    GEOMETRYWKT += string.Format(newWKTItemFormat(f.FT), cx, cy);
                }
                GEOMETRYWKT = GEOMETRYWKT.Remove(GEOMETRYWKT.Length - ((f.FT == "点") ? 1 : 2));
                GEOMETRYWKT = string.Format(wktformat, GEOMETRYWKT);
                geometry.GEOMETRY = GEOMETRYWKT;

                f.GeometryList.Add(geometry);
            }

            return ftList;
        }


        private string GetBOT(string type)
        {
            switch (type)
            {
                case "点":
                    {
                        return "井";
                    }
                case "线":
                    {
                        return "等值线";
                    }
                case "面":
                    {
                        return "含油气面积";
                    }
            }
            return string.Empty;
        }

        private string newWKTFormat(string type)
        {
            switch (type)
            {
                case "点":
                    {
                        return "POINT({0})";
                    }
                case "线":
                    {
                        return "LINESTRING({0})";
                    }
                case "含油气面积":
                    {
                        return "POLYGON(({0}))";
                    }
            }
            return string.Empty;
        }

        private string newWKTItemFormat(string type)
        {
            switch (type)
            {
                case "点":
                    {
                        return "{0} {1} ";
                    }
                case "线":
                    {
                        return "{0} {1}, ";
                    }
                case "含油气面积":
                    {
                        return "{0} {1}, ";
                    }
            }
            return string.Empty;
        }

        private DataTable ConvertToDataTable(string fileName)
        {
            DataTable dt = new DataTable();
            //ISheet sheet = hssfworkbook.GetSheetAt(0);
            System.Collections.IEnumerator rows = sheet.GetRowEnumerator();
            int colLength = sheet.GetRow(0).LastCellNum;
            for (int j = 0; j < colLength; j++)
            {
                dt.Columns.Add(Convert.ToChar(((int)'A') + j).ToString());
            }
            IRow row;
            ICell cell;
            DataRow dr;
            while (rows.MoveNext())
            {

                if (fileName.Contains("xlsx"))
                {
                    row = (XSSFRow)rows.Current;
                }
                else
                {
                    row = (HSSFRow)rows.Current;
                }

                dr = dt.NewRow();
                for (int i = 0; i < row.LastCellNum; i++)
                {
                    cell = row.GetCell(i);
                    if (cell == null)
                    {
                        dr[i] = null;
                    }
                    else
                    {
                        dr[i] = cell.ToString();
                    }
                }
                dt.Rows.Add(dr);
            }
            return dt;
        }
    }
}