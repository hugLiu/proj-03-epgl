using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Jurassic.Framework.EPGL.Web.Models
{
    /// <summary>
    /// 请求体 - 目标属性
    /// </summary>
    [Serializable]
    public class BOPropertyRequest
    {
        /// <summary>
        /// 目标类型
        /// </summary>
        [DataMember(Name = "BOT")]
        [JsonProperty("bot")]
        public string BOT { get; set; }

        /// <summary>
        /// 应用域
        /// </summary>
        [DataMember(Name = "AppDomain")]
        [JsonProperty("appdomain")]
        public string AppDomain { get; set; }

        /// <summary>
        /// 属性名集合
        /// </summary>
        [DataMember(Name = "Names")]
        [JsonProperty("names")]
        public List<BOPropertyName> Names { get; set; }
    }

    /// <summary>
    /// 目标属性名
    /// </summary>
    [Serializable]
    public class BOPropertyName
    {
        /// <summary>
        /// 应用域
        /// </summary>
        [DataMember(Name = "Name")]
        [JsonProperty("name")]
        public string Name { get; set; }

        /// <summary>
        /// 应用域
        /// </summary>
        [DataMember(Name = "ValueType")]
        [JsonProperty("valuetype")]
        public string ValueType { get; set; }
    }
}