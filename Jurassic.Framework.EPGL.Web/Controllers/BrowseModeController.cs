using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Web;
using System.Web.Mvc;
//using Jurassic.So.Adapter;
//using  JoWebClassLibrary;
//using JoGis4ClassLibrary;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class BrowseModeController : Controller
    {
        //private  JoWebClassX joWebX=new JoWebClassX();
        //private JoGis4ClassX joGis4X=new JoGis4ClassX();

        #region 油田图册
        public ActionResult OilFieldBook()
        {            
            return View();
        }
        /// <summary>
        /// 油田目录
        /// </summary>
        /// <returns></returns>
        public ActionResult OilFieldCatalogue(string data)
        {
            ViewBag.CatalogueData = data;
            
            return View();
        }

        /// <summary>
        /// 油田内容
        /// </summary>
        /// <returns></returns>
        public ActionResult OilFieldContent(string oilFieldName, string index)
        {
            //ViewBag.Url1= joWebX.GetBMP();
            //joGis4X.GetBMP();

            //下面的方法需要用到Jurassic.So.SQLAdapter
            //var builder = new GDBThumbnailBuilder();
            ////强制不转义
            //var file = @"C:\Users\Administrator\Desktop\克拉玛依油田白8井区石炭系油藏探明储量综合图.gdb";
            //报文件被占用错误
            //using (var input = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            //{
            //    var output = builder.Build(input, new Size(120, 120));
            //    //var file2 = @"D:\GTAPI\MockServicesData\Mock.gdb.png";
            //    //File.WriteAllBytes(file2, output.ToByteArray());
            //}


            ViewBag.OilFieldName = oilFieldName;
            //油田内容的第几页
            ViewBag.Index = index;
            return View();
        }

        /// <summary>
        /// 油藏目录
        /// </summary>
        /// <returns></returns>
        public ActionResult OilReservoirCatalogue(string data, string pageIndex)
        {
            ViewBag.ResCatalogueData = data;
            ViewBag.ResPageIndex = pageIndex;

            return View();
        }

        /// <summary>
        /// 油藏内容
        /// </summary>
        /// <returns></returns>
        public ActionResult OilReservoirContent(string oilFieldName, string oilReservoirName, string index)
        {
            ViewBag.OilFieldName_Res = oilFieldName;
            ViewBag.OilReservoirName = oilReservoirName;
            ViewBag.ResIndex = index;
            return View();
        }
        #endregion

        #region 指导意见图册

        public ActionResult GuidanceBook()
        {
            return View();
        }
        /// <summary>
        /// 图册封面
        /// </summary>
        /// <returns></returns>
        public ActionResult GuidanceCover()
        {
            return View();
        }
        /// <summary>
        /// 图册图例
        /// </summary>
        /// <returns></returns>
        public ActionResult GuidanceImgs()
        {
            return View();
        }
        /// <summary>
        /// 图册目录
        /// </summary>
        /// <returns></returns>
        public ActionResult GuidanceCatalogue(string data)
        {
            ViewBag.GuidanceCatalogueData = data;
            return View();
        }
        /// <summary>
        /// 图册前言
        /// </summary>
        /// <returns></returns>
        public ActionResult GuidancePreface()
        {
            return View();
        }
        /// <summary>
        /// 表格参数
        /// </summary>
        /// <returns></returns>
        public ActionResult GuidanceTableParam(string index,string imgIndex)
        {
            ViewBag.TableIndex = index;
            ViewBag.ImageIndex = imgIndex;
            return View();
        }
        /// <summary>
        /// 成果
        /// </summary>
        /// <returns></returns>
        public ActionResult GuidanceTableProduct(string index, string imgIndex)
        {
            ViewBag.TableIndex = index;
            ViewBag.ImageIndex = imgIndex;
            return View();
        }
        /// <summary>
        /// 实施指导意见
        /// </summary>
        /// <param name="type">text:内容描述,image:图片描述</param>
        /// <param name="index">下标</param>
        /// <param name="imgIndex">图片下标</param>
        /// <returns></returns>
        public ActionResult GuidanceData(string type,string index,string imgIndex)
        {
            ViewBag.IsImage = type=="image"?1:0;
            ViewBag.DataIndex = index;
            ViewBag.DataImageIndex = imgIndex;
            return View();
        }

        #endregion

        #region 产能建设图册

        public ActionResult BuildingBook()
        {
            return View();
        }
        /// <summary>
        /// 图册封面
        /// </summary>
        /// <returns></returns>
        public ActionResult BuildingCover()
        {
            return View();
        }
        /// <summary>
        /// 图册目录
        /// </summary>
        /// <returns></returns>
        public ActionResult BuildingCatalogue(string data)
        {
            ViewBag.BuildingCatalogueData = data;
            return View();
        }

        /// <summary>
        /// 整体图
        /// </summary>
        /// <returns></returns>
        public ActionResult BuildingImage()
        {
            return View();
        }

        /// <summary>
        /// 产能建设
        /// </summary>
        /// <param name="type">text:内容描述,image:图片描述</param>
        /// <param name="index">下标</param>
        /// <param name="imgIndex">图片下标</param>
        /// <returns></returns>
        public ActionResult BuildingData(string type, string index, string imgIndex)
        {
            ViewBag.IsImage = type == "image" ? 1 : 0;
            ViewBag.DataIndex = index;
            ViewBag.DataImageIndex = imgIndex;
            return View();
        }
        #endregion
    }
}