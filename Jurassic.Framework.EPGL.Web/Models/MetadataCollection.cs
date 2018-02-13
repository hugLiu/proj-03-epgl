using System;
using System.Collections.Generic;

namespace Jurassic.Framework.EPGL.Web.Models
{
    /// <summary>元数据集合</summary>
    [Serializable]
    public class MetadataCollection : List<Metadata>
    {
        /// <summary>构造函数</summary>
        public MetadataCollection()
        {
        }
        /// <summary>构造函数</summary>
        public MetadataCollection(IEnumerable<Metadata> values) : base(values)
        {
        }
    }
}
