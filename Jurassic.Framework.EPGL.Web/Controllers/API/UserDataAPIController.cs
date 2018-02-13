using Jurassic.EPGL.DataService.Service;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Jurassic.EPGL.Cache.Redis;
using Jurassic.EPGL.DataService;
using Newtonsoft.Json.Serialization;
using Jurassic.WebFrame;
using System.Runtime.Serialization;
using Jurassic.EPGL.DataService.Models;

namespace Jurassic.Framework.EPGL.Web.Controllers.API
{
    public class UserDataAPIController : BaseController
    {
        private static RedisHelper redis;

        private IUserDataService udService { get; set; }

        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="_gfService"></param>
        public UserDataAPIController(IUserDataService _udService)
        {
            //int redisdb = new Random().Next(0, 15);
            redis = new RedisHelper(RedisConfig.REDISDB_BO);
            udService = _udService;
        }

        #region 目标投影样式
        /// <summary>
        /// 获取高级搜索条件值集合
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetTargStyleSysSetting()
        {
            //获取缓存数据
            IEnumerable<object> result = redis.StringGet<List<object>>(RedisConfig.KEY_EPGL_LIST_TARGSTYLESYSSETTING, TimeSpan.FromDays(30));
            if (result == null)
            {
                //数据库获取
                result = udService.GetTargStyleSysSetting();

                //缓存数据
                redis.StringSet(RedisConfig.KEY_EPGL_LIST_TARGSTYLESYSSETTING, result, TimeSpan.FromDays(30));
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取高级搜索条件值集合
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        [HttpGet]
        public JsonResult GetTargStyleUConfByUser()
        {
            var userid = decimal.Parse(CurrentUserId);
            var result = udService.GetTargStyleUConfByUser(userid); 
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 保存用户配置
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SaveTargStyleUConfig(IEnumerable<TargStyleUConf> request)
        {
            var result = udService.SaveTargStyleUConfig(request);

            return Json(result);
        }
        #endregion 目标投影样式

        #region 搜索历史
        /// <summary>
        /// 获取高级搜索条件值集合
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetSearchHistoryByUser(decimal userid)
        {
            var result = udService.GetTargStyleUConfByUser(userid);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 保存用户配置
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetSearchHistoryByUser(SearchHistoryRequest request)
        {
            var userid = request.USERID;
            var smode = request.SMODE;
            var top = request.TOP;
            var exp = new TimeSpan(0, 1, 0, 0);//1小时过期
            //获取缓存数据
            IEnumerable<SearchHistoryResult> result = redis.StringGet<List<SearchHistoryResult>>(RedisConfig.GetKEY_UserSearchHisResult(userid, smode, top), exp);
            if (result == null)
            {
                //数据库获取
                result = udService.GetSearchHistoryByUser(userid, smode, top);

                //缓存数据
                redis.StringSet(RedisConfig.GetKEY_UserSearchHisResult(userid, smode, top), result, exp);
            }

            return Json(result);
        }

        /// <summary>
        /// 保存用户配置
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddSearchHistory(SearchHistoryInput entity)
        {
            var result = udService.AddSearchHistory(entity);

            return Json(result);
        }
        #endregion 搜索历史

        #region 应用数据用户个性模板
        /// <summary>
        /// 获取高级搜索条件值集合
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        [HttpGet]
        public JsonResult GetAppDProfileUserTemplate()
        {
            var userid = decimal.Parse(CurrentUserId);
            var result = udService.GetAppDProfileUserTemplate(userid);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 保存用户配置
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult DelAppDProfileUserTemplate(IEnumerable<AppDataProfileTemplate> request)
        {
            var result = udService.DelAppDProfileUserTemplate(request);

            return Json(result);
        }

        /// <summary>
        /// 保存用户配置
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SaveAppDProfileUserTemplate(IEnumerable<AppDataProfileTemplate> request)
        {
            var userid = decimal.Parse(CurrentUserId);
            var count = udService.SaveAppDProfileUserTemplate(request, userid);
            if (count > 0)
            {
                var result = udService.GetAppDProfileUserTemplate(userid);
                return Json(result);
            }
            return null;
        }

        /// <summary>
        /// 获取高级搜索条件值集合
        /// </summary>
        /// <returns></returns>
        [LoginAuthorize]
        [HttpGet]
        public JsonResult GetAppDProfileByUser(decimal dptempid=0)
        {
            var userid = decimal.Parse(CurrentUserId);
            var result = udService.GetAppDProfileByUser(userid, dptempid);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 保存用户配置
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SaveAppDProfileByUser(List<AppDataProfile> request)
        {
            if (request!=null&& request[0]!=null)
            {
                var userid = decimal.Parse(CurrentUserId);
                var count = udService.DelAppDProfileByUser(userid, request[0].DPTEMPID, request[0].DATACLASSID);

                if (count > -1)
                {
                    var result = udService.SaveAppDProfileByUser(request, userid);
                    return Json(result);
                }
            }
            
            return null;

            
        }
        #endregion 应用数据用户个性模板
    }

    [Serializable]
    public class SearchHistoryRequest
    {
        [DataMember(Name = "USERID")]
        [JsonProperty("userid")]
        public decimal USERID { get; set; }

        [DataMember(Name = "SMODE")]
        [JsonProperty("smode")]
        public int SMODE { get; set; }

        [DataMember(Name = "TOP")]
        [JsonProperty("top")]
        public int TOP { get; set; }
    }
}