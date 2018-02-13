using Jurassic.EPGL.DataService.Models;
using Jurassic.EPGL.DataService.Service;
using Jurassic.WebFrame;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers.Service
{
    public class UserBehaviorServiceController : BaseController
    {
        /// <summary>
        /// 服务层接口
        /// </summary>
        private IUSERBEHAVIORService userBehaviorService { get; set; }
        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="_userBehaviorService"></param>
        public UserBehaviorServiceController(IUSERBEHAVIORService _userBehaviorService)
        {
            userBehaviorService = _userBehaviorService;
        }

        /// <summary>
        /// 获取当前图件的用户行为
        /// </summary>
        /// <param name="iiid"></param>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult GetUserFavorite(List<string> ids)
        {
            var userId = Convert.ToInt32(CurrentUser.Id);
            var result = userBehaviorService.GetUserBehaviorByKeys(ids, userId, 1).Where(u => u.FAVORITEFLAG == 1).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 更新用户行为
        /// </summary>
        /// <param name="updateType">1:更新浏览记录2：更新收藏状态3：更新下载记录</param>
        /// <param name="iiid"></param>
        /// <param name="metaPT"></param>
        /// <param name="metaTitle"></param>
        /// <param name="metaAuthor"></param>
        /// <param name="metaSourceUrl"></param>
        /// <param name="metaCreateDate"></param>
        /// <param name="metaIndexDate"></param>
        /// <param name="lookFlag"></param>
        /// <param name="lookCount">新增浏览次数</param>
        /// <param name="favoriteFlag"></param>
        /// <param name="downloadFlag"></param>
        /// <param name="downloadCount">新增下载次数</param>
        /// <param name="favCatalogId"></param>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult UpdateUserBehavior(int updateType, string iiid, string metaPT, string metaTitle, string metaAuthor, string metaSourceUrl, string metaCreateDate, string metaIndexDate, int? favCatalogId, int lookFlag = 0, int lookCount = 0, int favoriteFlag = 0, int downloadFlag = 0, int downloadCount = 0)
        {
            var userId = Convert.ToInt32(CurrentUser.Id);
            var model = new USERBEHAVIORModel
            {
                IIID = iiid,
                USERID = userId,
                METAPT = metaPT,
                METATITLE = metaTitle,
                METAAUTHOR = metaAuthor,
                METASOURCEURL = metaSourceUrl,
                METADESC = "",
                METACREATEDATE = !string.IsNullOrEmpty(metaCreateDate) ? Convert.ToDateTime(metaCreateDate) : DateTime.Now,
                METAINDEXDATE = !string.IsNullOrEmpty(metaIndexDate) ? Convert.ToDateTime(metaIndexDate) : DateTime.Now,
                LOOKFLAG = lookFlag,
                LOOKCOUNT = lookCount,
                LOOKDATE = DateTime.Now,
                FAVORITEFLAG = favoriteFlag,
                FAVCATALOGID = favCatalogId,
                FAVORITEDATE = DateTime.Now,
                DOWNLOADFLAG = downloadFlag,
                DOWNLOADCOUNT = downloadCount,
                DOWNLOADDATE = DateTime.Now,
                STATE = 1
            };
            var result = model;
            switch (updateType)
            {
                case 1:
                    result = userBehaviorService.UpdateLookStatus(model);
                    break;
                case 2:
                    result = userBehaviorService.UpdateFavoriteStatus(model);
                    break;
                case 3:
                    result = userBehaviorService.UpdateDownloadStatus(model);
                    break;
                default:
                    break;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取当前用户收藏列表
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult GetFavoriteList(int? favCatalogId)
        {
            int userId = Convert.ToInt32(CurrentUser.Id);
            var result = userBehaviorService.GetFavoriteByKey(userId, favCatalogId).OrderByDescending(f => f.FAVORITEDATE).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取当前用户下载列表
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult GetDownloadList()
        {
            int userId = Convert.ToInt32(CurrentUser.Id);
            var result = userBehaviorService.GetDownloadByUserId(userId).OrderByDescending(f => f.DOWNLOADDATE).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取当前用户预览列表
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult GetLookList()
        {
            int userId = Convert.ToInt32(CurrentUser.Id);
            var result = userBehaviorService.GetLookByUserId(userId).OrderByDescending(f => f.LOOKDATE).Take(10).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}