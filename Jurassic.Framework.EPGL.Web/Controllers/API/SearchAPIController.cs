using Jurassic.EPGL.DataService.Service;
using Jurassic.So.Infrastructure;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Jurassic.PKS.Service;
using Jurassic.Framework.EPGL.Web.Models;
using Jurassic.EPGL.Cache.Redis;
using Jurassic.EPGL.DataService;
using System.Text;
using Jurassic.Framework.EPGL.Web.Models.API;
using Newtonsoft.Json.Serialization;
using Jurassic.WebFrame;
using Jurassic.EPGL.DataService.Models.GF;
using Jurassic.PKS.Service.Search;
using System.Threading.Tasks;

namespace Jurassic.Framework.EPGL.Web.Controllers.API
{
    public class SearchAPIController : BaseController
    {
        /// <summary>
        /// Web服务类
        /// </summary>
        private static RedisHelper redis;

        /// <summary>
        /// 服务层接口
        /// </summary>
        private IGFService gfService { get; set; }
        private IJoinTableCommonService joinTableCommonService { get; set; }
        private IUserDataService udService { get; set; }

        private IQuery queryService { get; }

        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="_gfService"></param>
        public SearchAPIController(IGFService _gfService, IUserDataService _udService, IQuery _query, IJoinTableCommonService _joinTableCommonService)
        {
            //int redisdb = new Random().Next(0, 15);
            redis = new RedisHelper(RedisConfig.REDISDB_BO);
            gfService = _gfService;
            joinTableCommonService = _joinTableCommonService;
            udService = _udService;
            queryService = _query;
        }


        /// <summary>
        /// 获取高级搜索条件值集合
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetParameterItems(SearchParamRequest request)
        {
            //获取目标集合（Redis缓存）（盆地、区带、油田、油藏）
            IEnumerable<BOTreeResult> targets = gfService.GetBOTree(request.targets.query.root);
            //获得地层序列数据
            IEnumerable<object> geologyseries = udService.GetGeologySeries();
            //油藏属性（Redis缓存）
            StringBuilder sbpnames = new StringBuilder();
            if (request.poolparams.query.Names != null)
            {
                //属性名参数处理
                foreach (BOPropertyName pn in request.poolparams.query.Names)
                    sbpnames.AppendFormat("{0}|{1},", pn.Name, pn.ValueType);
                sbpnames.Remove(sbpnames.Length - 1, 1);
            }
            BOPropertyQuery querypoolparams = new BOPropertyQuery
            {
                BOT = request.poolparams.query.BOT,
                AppDomain = request.poolparams.query.AppDomain,
                ParamNames = sbpnames.ToString()
            };
            IEnumerable<BOPropertyParamResult> poolparams = gfService.GetPropertyParams(querypoolparams);

            //图件元数据
            //var docrequest = request.documents.query;
            //var documents = Task.Run(() => queryService.MatchAsync(docrequest.MapTo<MatchCondition>())).Result;

            //组合返回数据
            SearchParamItemSetting settings = new SearchParamItemSetting { };
            SearchParamItemData data = new SearchParamItemData { targets = targets, geologyseries = geologyseries, poolparams = poolparams };
            SearchParamResponse result = new SearchParamResponse { settings = settings, data = data };

            return Json(result);
        }
    }
}