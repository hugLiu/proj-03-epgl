
using Jurassic.AppCenter;
using Jurassic.EPGL.DataService;
using Jurassic.EPGL.DataService.Models;
using Jurassic.EPGL.DataService.Service;
using Jurassic.WebFrame;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class MySpaceController : BaseController
    {
        /// <summary>
        /// 服务层接口
        /// </summary>
        private IAPPDATAMODELService appDataModelService { get; set; }

        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="_appDataModelService"></param>
        public MySpaceController(IAPPDATAMODELService _appDataModelService)
        {
            appDataModelService = _appDataModelService;
        }
        [LoginAuthorize]
        public ActionResult Index()
        {
            ViewBag.userName = User.Identity.GetUserName();
            ViewBag.ActiveTab = "MySpace";

            return View();
        }    
        /// <summary>
        /// 获取图数联动列表字段数据
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        [HttpPost]
        public JsonResult GetDataColumns()
        {
            var result= appDataModelService.GetAPPDATAMODELInfo(new APPDATAMODELModel { DATACLASSID = 0 })
                .Where(d=>d.DATACLASSID<=7)
                .GroupBy(a => a.DATACLASSID)
                .OrderBy(b => b.Key)
                .Select(g=>new { key=g.Key,data=g})
                .ToList();
            return Json(result,JsonRequestBehavior.AllowGet);
        }
    }
}