using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Jurassic.Framework.EPGL.Web.Models.API
{
    [Serializable]
    public class SearchParamResponse
    {
        [DataMember(Name = "Settings")]
        [JsonProperty("settings")]
        public SearchParamItemSetting settings { get; set; }
        [DataMember(Name = "Data")]
        [JsonProperty("data")]
        public SearchParamItemData data { get; set; }
    }

    [Serializable]
    public class SearchParamItemSetting
    {
        [DataMember(Name = "Targets")]
        [JsonProperty("targets")]
        public IEnumerable<object> targets { get; set; }
        [DataMember(Name = "GeologySeries")]
        [JsonProperty("geologyseries")]
        public IEnumerable<object> geologyseries { get; set; }
        [DataMember(Name = "PoolParams")]
        [JsonProperty("poolparams")]
        public IEnumerable<object> poolparams { get; set; }
    }
    [Serializable]
    public class SearchParamItemData
    {
        [DataMember(Name = "Targets")]
        [JsonProperty("targets")]
        public IEnumerable<object> targets { get; set; }
        [DataMember(Name = "GeologySeries")]
        [JsonProperty("geologyseries")]
        public IEnumerable<object> geologyseries { get; set; }
        [DataMember(Name = "PoolParams")]
        [JsonProperty("poolparams")]
        public IEnumerable<object> poolparams { get; set; }
        //[DataMember(Name = "ProductTypes")]
        //[JsonProperty("producttypes")]
        //public List<string> producttypes { get; set; }
        //[DataMember(Name = "Years")]
        //[JsonProperty("years")]
        //public List<int> years { get; set; }
        //[DataMember(Name = "Documents")]
        //[JsonProperty("documents")]
        //public object documents { get; set; }
    }
}