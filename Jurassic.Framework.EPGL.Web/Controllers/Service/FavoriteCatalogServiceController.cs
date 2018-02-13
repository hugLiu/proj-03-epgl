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
    public class FavoriteCatalogServiceController : BaseController
    {
        /// <summary>
        /// 服务层接口
        /// </summary>
        private IFAVORITECATALOGService favoriteCatalogService { get; set; }
        private IUSERBEHAVIORService userBehaviorService { get; set; }
      
        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="_favoriteCatalogService"></param>
        public FavoriteCatalogServiceController(IFAVORITECATALOGService _favoriteCatalogService, IUSERBEHAVIORService _userBehaviorService)
        {
            favoriteCatalogService = _favoriteCatalogService;
            userBehaviorService = _userBehaviorService;
        }

        /// <summary>
        /// 获取当前用户收藏夹树
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult GetFavoriteFolderTree()
        {
            var userId = Convert.ToInt32(CurrentUser.Id);
            var result = favoriteCatalogService.GetFavoriteCatalogByUserId(userId).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 新增/编辑收藏文件夹
        /// </summary>
        /// <param name="favCatalogId"></param>
        /// <param name="favName"></param>
        /// <param name="parentCatalogId"></param>
        /// <returns></returns>
        [LoginAuthorize]
        public ActionResult UpdateFavoriteFolder(int favCatalogId, string favName, int? parentCatalogId)
        {
            var userId = Convert.ToInt32(CurrentUser.Id);
            var userName = CurrentUser.Name;

            var model = new FAVORITECATALOGModel
            {
                FAVCATALOGID = favCatalogId,
                FAVNAME = favName,
                PARENTCATALOGID = parentCatalogId,
                UPDATEDBY = userName,
                UPDATEDDATE = DateTime.Now
            };
            if (favCatalogId == 0)
            {
                model.USERID = userId;
                model.FAVNAME = favName;
                model.PARENTCATALOGID = parentCatalogId;
                model.CREATEDBY = userName;
                model.CREATEDDATE = DateTime.Now;
                model.UPDATEDBY = userName;
                model.UPDATEDDATE = DateTime.Now;

                favCatalogId = favoriteCatalogService.AddFavoriteCatalog(model);
            }
            else
            {
                favCatalogId = favoriteCatalogService.UpdateFavoriteCatalog(model);
            }


            return Json(favCatalogId, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 删除收藏文件夹
        /// </summary>
        /// <param name="favCatalogId"></param>
        /// <returns></returns>
        public ActionResult DeleteFavoriteFolder(int favCatalogId)
        {
            //先查找该收藏文件夹下的收藏记录
            userBehaviorService.DeleteUserBehaviorByFavCat(favCatalogId);

            favoriteCatalogService.DeleteFavoriteCatalog(favCatalogId);

            return Content("success");
        }
    }
}