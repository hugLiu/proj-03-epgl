using GGGXParse;
using Jurassic.EPGL.Cache.Redis;
using Jurassic.EPGL.DataService;
using Jurassic.EPGL.DataService.Models;
using Jurassic.EPGL.DataService.Service;
using Jurassic.WebFrame;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class TargetNavController : BaseController
    {
        /// <summary>
        /// 服务层接口
        /// </summary>
        private IAPPDATAMODELService appDataModelService { get; set; }
        
        private static RedisHelper redis;

        /// <summary>
        /// 构造函数注入
        /// </summary>
        public TargetNavController(IAPPDATAMODELService _appDataModelService)
        {
            appDataModelService = _appDataModelService;
            redis = new RedisHelper(RedisConfig.REDISDB_BO);
        }

        [LoginAuthorize]
        public ActionResult Index(string currentTarget, string currentElementName)
        {
            
            ViewBag.CurrentTargetNode = currentTarget;
            ViewBag.CurrentElementName = currentElementName;
            ViewBag.ActiveTab = "TargetNav";

            return View();
        }

        public PartialViewResult LoadMap(string mapType)
        {
            if (mapType == "geomap")
            {
                return PartialView("GeoMapPartial");
            }
            else
            {
                //地形图和卫星图用同一个页面
                return PartialView("MapPartial");
            }

        }

        public ActionResult AddProject(string id)
        {
            var gml = LoadImpFileTo3GX("file-input");
            var xml = gml.InnerXml;
            if (!string.IsNullOrEmpty(xml))
            {
                var ts = new TimeSpan(1, 0, 0, 0);
                var key = RedisConfig.GetKEY_ProjectBOResult(id);
                redis.StringSet(key, xml, ts);
            }
            return Json(xml);
        }

        public ActionResult GetBoProject(string pKey)
        { 
            var key = RedisConfig.GetKEY_ProjectBOResult(pKey);
            var keyExist = redis.KeyExists(key); //缓存是否存在key,gms负责key的销毁 
            if (keyExist)
            { 
                return Content(redis.StringGet(key));
            }
            return null;
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
                    gf = new GeoFeature { BOID = Guid.NewGuid().ToString(), NAME = fname, BOT = GetBOT(type), FT = type };
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
                case "面":
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
                case "面":
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

        private string SaveUploadFile(string file_input, string savedir = null)
        {
            Stream sr = HttpContext.Request.InputStream;
            byte[] bt = new byte[sr.Length];
            var file = HttpContext.Request.Files[file_input];
            string fileName = file.FileName;
            string savepath = AppDomain.CurrentDomain.BaseDirectory;
            if (!string.IsNullOrEmpty(savedir))
                savepath += "\\" + savedir;
            savepath += "\\" + fileName;//获取文件保存的路径
            sr.Read(bt, 0, bt.Length);
            FileStream fs = new FileStream(savepath, FileMode.Create);
            fs.Write(bt, 0, bt.Length);
            fs.Close();
            sr.Close();
            return savepath;
        }
    }
}