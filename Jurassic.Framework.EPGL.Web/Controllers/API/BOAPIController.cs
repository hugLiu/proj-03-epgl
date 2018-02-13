using Jurassic.EPGL.DataService.Models.GF;
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
using Jurassic.PKS.Service.GF;
using System.IO;
using System.Web.Script.Serialization;

namespace Jurassic.Framework.EPGL.Web.Controllers.API
{
    public class BOAPIController : Controller
    {
        /// <summary>
        /// Web服务类
        /// </summary>
        private WebServiceController Service = new WebServiceController();
        private static RedisHelper redis;

        /// <summary>
        /// 服务层接口
        /// </summary>
        private IGFService gfService { get; set; }
        private IJoinTableCommonService joinTableCommonService { get; set; }

        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="_gfService"></param>
        public BOAPIController(IGFService _gfService, IJoinTableCommonService _joinTableCommonService)
        {
            //int redisdb = new Random().Next(0, 15);
            redis = new RedisHelper(RedisConfig.REDISDB_BO);
            gfService = _gfService;
            joinTableCommonService = _joinTableCommonService;
        }

        // GET: BOAPI
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 搜索目标属性信息
        /// </summary>
        /// <param name="BOName">目标名称（模糊匹配）</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SearchBODataByName(string BOName)
        {
            //缓存复合数据
            IEnumerable<SearchBOResult> result = redis.StringGet<List<SearchBOResult>>(RedisConfig.GetKey_ListSearchBODataResult(BOName));
            if (result == null)
            {
                //数据库获取
                result = gfService.SearchBOByName(BOName);
               
                //缓存数据
                redis.StringSet(RedisConfig.GetKey_ListSearchBODataResult(BOName), result);
            }

            return Json(result);
        }

        /// <summary>
        /// 搜索目标
        /// </summary>
        /// <param name="BOName">目标名称（模糊匹配）</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SearchBOByName(string BOName)
        {
            //缓存复合数据
            IEnumerable<SearchBOResult> result = redis.StringGet<List<SearchBOResult>>(RedisConfig.GetKey_ListSearchBOResult(BOName));
            if (result == null)
            {
                //数据库获取
                result = gfService.SearchBOByName(BOName);

                //遍历目标搜索结果，获取图件url
                string mapfilename = string.Empty;
                string searchmapparams = string.Empty;
            
                foreach(SearchBOResult bo in result)
                {
                    //注意每次循环searchmapparams是重新赋值，直接+操作会保留上一次的查询条件
                    searchmapparams = "{\"pager\":{\"from\":0,\"size\":1},\"filter\":{\"$and\":[{\"dc.title.text\":{\"$regex\":\"";
                    mapfilename = bo.MapFileName;
                    searchmapparams += mapfilename;
                    searchmapparams += "\",\"$options\":\"i\"}},{\"dc.title.type\":\"Formal\"}]}}";
                    var responseMatch = Service.GetMatch(searchmapparams);
                    QueryResult res = JsonUtil.JsonTo<QueryResult>(responseMatch.Content);
                    if (res.Metadatas.Count == 0) continue;
                    Metadata metadata = res.Metadatas[0];
                    var iiid = metadata.GetValueBy("iiid");
                    Newtonsoft.Json.Linq.JObject source = metadata.GetValueBy("source").As<Newtonsoft.Json.Linq.JObject>();
                    string sourceurl = source["url"].ToString();
                    var responseRetrieve = Service.GetRetrieve(new Dictionary<string, string> { { "url", sourceurl } });
                    Newtonsoft.Json.Linq.JArray data = Newtonsoft.Json.Linq.JArray.Parse(responseRetrieve.Data.ToString());
                    var ticket = data[0]["ticket"].ToString();
                    bo.MapDataUrl = string.Format("/DataService/GetData?url={0}&ticket={1}", sourceurl, ticket);
                    metadata.GetValueBy("source");

                    var ep = metadata.GetValueBy("ep").As<object>();
                    var bos = ep.As<Newtonsoft.Json.Linq.JObject>()["bo"];
                    var mapfileBos = Newtonsoft.Json.Linq.JArray.Parse(bos.ToString())
                        .Select(b => new MapBoProperty
                        {
                            TYPE = b["type"].ToString(),
                            VALUE=b["value"].ToString()
                        }
                        );
                    bo.MapBos = mapfileBos.ToList();
                }
                //缓存数据
                redis.StringSet(RedisConfig.GetKey_ListSearchBOResult(BOName), result);
            }

            return Json(result);
        }

        /// <summary>
        /// 获取目标树
        /// </summary>
        /// <param name="rootBOName">根目标名称</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetBOTree(string rootBOName = null)
        {
            IEnumerable<BOTreeResult> tree = gfService.GetBOTree(rootBOName);
            return Json(tree);
        }

        /// <summary>
        /// 获取目标属性参数值
        /// </summary>
        /// <param name="request">参数请求</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetPropertyParams(BOPropertyRequest request)
        {
            StringBuilder sbpnames = new StringBuilder();
            if (request.Names != null)
            {
                //属性名参数处理
                foreach (BOPropertyName pn in request.Names)
                    sbpnames.AppendFormat("{0}|{1},", pn.Name, pn.ValueType);
                sbpnames.Remove(sbpnames.Length - 1, 1);
            }

            BOPropertyQuery query = new BOPropertyQuery {
                BOT = request.BOT,
                AppDomain = request.AppDomain,
                ParamNames = sbpnames.ToString()
            };

            IEnumerable<BOPropertyParamResult> result = gfService.GetPropertyParams(query);
            return Json(result);
        }


        /// <summary>
        /// 获取井，油藏的部分属性数据
        /// </summary>
        /// <param name="typeId">DATACLASSID</param>
        /// <param name="boId">name</param>
        /// <returns></returns>
        public JsonResult GetProDataInfoByType(int typeId, string boId)
        {
            //缓存目标属性值
            BOPropertyDataResult result = redis.StringGet<BOPropertyDataResult>(RedisConfig.GetKey_BOPropertyDataResult(boId));
            if (result==null)
            {
                var data = joinTableCommonService.GetProDataList(typeId, boId).ToList();

                var aliasNames = joinTableCommonService.GetBoAliasName(boId).ToList();

                var columns = new List<string>();
                for (var i = 0; i < data.Count; i++)
                {
                    columns.Add(data[i].CAPTION);
                }

                result = new BOPropertyDataResult
                {
                    ProData=data,
                    ProColumns=columns,
                    AliasName=aliasNames
                };

                //缓存数据
                redis.StringSet(RedisConfig.GetKey_BOPropertyDataResult(boId), result);
            }
           
            return Json(result);
        }


        /// <summary>
        /// 根据油藏属性获取油藏目标信息
        /// </summary>
        /// <param name="filterJson"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetBoListHasAliasByFilter()
        {
            var sr = new StreamReader(Request.InputStream);
            var stream = sr.ReadToEnd();
            var request = JsonUtil.JsonTo<BOListByFilterRequest>(stream);

            //json序列化后md5加密生成识别码
            string hashcode = JsonUtil.ToJsonPlain(request);
            hashcode = HashUtil.ToMD5(hashcode);
            //从缓存中获取返回值
            IEnumerable<BOList> result = redis.StringGet<IEnumerable<BOList>>(RedisConfig.GetKey_ListBoHasAlias(hashcode), TimeSpan.FromDays(30));

            if (result == null)
            {
                //result = gfService.GetBoListHasAliasByFilter(bot, filter);
                result = gfService.SPGetBoListHasAliasByFilter(request);

                //缓存数据
                redis.StringSet(RedisConfig.GetKey_ListBoHasAlias(hashcode), result, TimeSpan.FromDays(30));
            }
            return Json(result);
        }
        private string FilterToJson(object objFilter)
        {
            var filter = string.Empty;
            if (objFilter != null && objFilter.ToJson() != "{}")
                filter = objFilter.ToJson();
            return filter;
        }

        /// <summary>
        /// 扩展GF API 获取指定业务对象类型和符合属性过滤条件的业务对象
        /// </summary>
        /// <param name="bot">返回的业务对象类型</param>
        /// <param name="wktBBox">符合WKT的格式空间范围</param>
        /// <returns>业务对象集合<c>BOCollection</c></returns>
        [HttpPost]
        public JsonResult GetBOListByFilter(BOListByFilterRequest request)
        {
            var bot = request.BOT;
            var bos = request.BOS;
            var bbox = request.BBox;

            IEnumerable<BOListHasProperty> result = gfService.GetBOListHasProperty(bot, string.Join(",", bos), bbox);
            return Json(result);
        }

        /// <summary>
        /// 扩展GF API 根据过滤条件获取3GX属性信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult GetFeatures()
        {
            var sr = new StreamReader(Request.InputStream);
            var stream = sr.ReadToEnd();
            var request = JsonUtil.JsonTo<FeatureFilter>(stream);

            var gml = gfService.GetFeatures(request);
            return new StreamResult(gml.ToStream());
        }

        /// <summary>
        /// 扩展GF API 根据过滤条件获取3GX属性信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult GetFeaturesGeoJSON()
        {
            var sr = new StreamReader(Request.InputStream);
            var stream = sr.ReadToEnd();
            var request = JsonUtil.JsonTo<FeatureFilter>(stream);

            var featurecollection = gfService.GetFeatureCollection(request)
                .Select(r => new { name = r.NAME, geometry = r.GeometryList.Select(g => new { geometry = g.GEOMETRY }) });
            var result = new { type = "FeatureCollection", features = featurecollection };
            return new ContentResult
            {
                Content = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue }.Serialize(result),
                ContentType = "application/json"
            };
        }
    }
}