using Jurassic.EPGL.Cache.Redis;
using Jurassic.EPGL.DataService;
using Jurassic.EPGL.DataService.Models;
using Jurassic.EPGL.DataService.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class FlexDrawController : Controller
    {

        WebServiceController Service = new WebServiceController();
        private static RedisHelper redis;
        private IGMSService gmsService { get; set; }

        /// <summary>
        /// 构造函数，初始化redis
        /// </summary>
        public FlexDrawController(IGMSService _gmsService)
        {
            redis = new RedisHelper(RedisConfig.REDISDB_BO);
            gmsService = _gmsService;
        }

        public ActionResult Index()
        {

            return View();
        }

        public ActionResult LaySelTarget()
        {
            return View();
        }

        public ActionResult LaySelector()
        {
            return View();
        }

        /// <summary>
        /// 一键成图
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult QuickDraw()
        {
            ViewBag.ActiveTab = "FlexDraw";
            return View();
        }

        /// <summary>
        /// 投影叠加
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult AddProject()
        {
            ViewBag.ActiveTab = "FlexDraw";
            return View();
        }

        /// <summary>
        /// 数图成图
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult DataDraw()
        {
            ViewBag.ActiveTab = "FlexDraw";
            return View();
        }

        /// <summary>
        /// 一键成图（备份）
        /// </summary>
        public ActionResult QuickDraw1()
        {
            return View();
        }

        /// <summary>
        /// 动态图形（改版）
        /// </summary>
        [LoginAuthorize]
        public ActionResult DynamicDraw()
        {
            ViewBag.ActiveTab = "FlexDraw";
            return View();
        }

        /// <summary>
        /// 获取虚图
        /// </summary>
        public ActionResult GetVMap(string vMapId)
        {
            var content = string.Empty;
            var key = RedisConfig.GetKey_EPGL_LIST_VMapIds(vMapId);
            var keyExist = redis.KeyExists(key); //缓存是否存在key,gms负责key的销毁 
            if (keyExist)
            {
                content = redis.StringGet(key);
            }
            else
            {
                var prams = new Dictionary<string, string>();
                prams.Add("vMapId", vMapId);
                content = Service.GetMap(prams).Content;
                if (!string.IsNullOrEmpty(content))
                {
                    redis.StringSet(key, content);
                }
            }
            return Content(content);
        }

        /// <summary>
        /// 获取虚图图件类型
        /// </summary>
        public JsonResult GetMapType(string workareaName)
        {
            var list = gmsService.GetVMapInfoExpand(new T_VMapExpandModel { WORKAREANAME = workareaName }).Select(x => x.TYPENAME).ToList();
            return Json(list);
        }

        /// <summary>
        /// 获取虚图图件的name
        /// </summary>
        public JsonResult GetVMapName(string boName, string type)
        {
            var list = gmsService.GetVMapInfo(new T_VMapExpandModel { WORKAREANAME = boName, TYPENAME = type }).Select(x => new { x.VMAPID, x.VMAPNAME }).ToList();
            return Json(list);
        }

        /// <summary>
        /// 获取图件类型(全部)
        /// </summary> 
        public JsonResult GetMapTypeName()
        {
            var list = gmsService.GetMapTypeName().Select(x => x.TYPENAME).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}