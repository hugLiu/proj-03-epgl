using Jurassic.PKS.Service;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Jurassic.Framework.EPGL.Web.Models.API
{
    [Serializable]
    public class SearchParamRequest
    {
        [DataMember(Name = "Targets")]
        [JsonProperty("targets")]
        public TargetRequest targets { get; set; }

        [DataMember(Name = "GeologySeries")]
        [JsonProperty("geologyseries")]
        public GeologySeriesRequest geologyseries { get; set; }

        [DataMember(Name = "PoolParams")]
        [JsonProperty("poolparams")]
        public PoolParamsRequest poolparams { get; set; }

        //[DataMember(Name = "Documents")]
        //[JsonProperty("documents")]
        //public DocumentsRequest documents { get; set; }
    }

    public class TargetRequest
    {
        [DataMember(Name = "Query")]
        [JsonProperty("query")]
        public QueryTreeBase query { get; set; }
    }

    public class GeologySeriesRequest
    {
        [DataMember(Name = "Query")]
        [JsonProperty("query")]
        public QueryTreeBase query { get; set; }
    }

    public class PoolParamsRequest
    {
        [DataMember(Name = "Query")]
        [JsonProperty("query")]
        public BOPropertyRequest query { get; set; }
    }

    //public class DocumentsRequest
    //{
    //    [DataMember(Name = "Query")]
    //    [JsonProperty("query")]
    //    public MatchRequest query { get; set; }
    //}

    public class QueryTreeBase
    {
        [DataMember(Name = "Root")]
        [JsonProperty("root")]
        public string root { get; set; }
    }
}