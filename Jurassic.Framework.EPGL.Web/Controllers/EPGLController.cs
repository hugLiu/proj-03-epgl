
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Jurassic.WebFrame;
using Jurassic.EPGL.DataService.Service;
using System.Configuration;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class EPGLController : BaseController
    {

        /// <summary>
        /// 服务层接口
        /// </summary>
        private IUSERBEHAVIORService userBehaviorService { get; set; }

        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="_userBehaviorService"></param>
        public EPGLController(IUSERBEHAVIORService _userBehaviorService)
        {
            userBehaviorService = _userBehaviorService;
        }

        [LoginAuthorize]
        public ActionResult Index()
        {
            ViewBag.ActiveTab = "EPGL";
            return View();
        }

        /// <summary>
        /// 获取当前用户的近期收藏列表(前十位)
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public JsonResult GetFavoriteList()
        {
            int userId = Convert.ToInt32(CurrentUser.Id);
            var result = userBehaviorService.GetFavoriteByUserId(userId).OrderByDescending(f => f.FAVORITEDATE).Take(10).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取当前用户的近期下载列表(前十位)
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public JsonResult GetDownloadList()
        {
            int userId = Convert.ToInt32(CurrentUser.Id);
            var result = userBehaviorService.GetDownloadByUserId(userId).OrderByDescending(f => f.DOWNLOADDATE).Take(10).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取当前用户的近期预览列表(前十位)
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public JsonResult GetLookList()
        {
            int userId = Convert.ToInt32(CurrentUser.Id);
            var result = userBehaviorService.GetLookByUserId(userId).OrderByDescending(f => f.LOOKDATE).Take(10).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }


    }
}