using Jurassic.PKS.Service;
using Jurassic.So.Business;
using Jurassic.So.Infrastructure;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.Serialization;

namespace Jurassic.Framework.EPGL.Web.Models
{
    /// <summary>元数据</summary>
    [Serializable]
    public class Metadata : Dictionary<string, object>, IMetadata
    {
        #region 构造函数
        /// <summary>构造函数</summary>
        public Metadata() { }
        /// <summary>构造函数</summary>
        public Metadata(IDictionary<string, object> values) : base(values) { }
        /// <summary>构造函数</summary>
        public Metadata(string json)
        {
            json.JsonTo().As<JObject>().JsonToDictionary(this);
        }
        /// <summary>构造函数(用序列化数据初始化)</summary>
        protected Metadata(SerializationInfo info, StreamingContext context) : base(info, context) { }
        #endregion

        #region IMetadata接口
        /// <summary>索引数据ID</summary>
        [IgnoreDataMember, JsonIgnore]
        public string IIId
        {
            get { return (string)this.GetValueBy(MetadataConsts.IIId); }
            set { base[MetadataConsts.IIId] = value; }
        }
        /// <summary>索引数据日期</summary>
        [IgnoreDataMember, JsonIgnore]
        public DateTime? IndexedDate
        {
            get { return (DateTime)this.GetValueBy(MetadataConsts.IndexedDate); }
            set { base[MetadataConsts.IndexedDate] = value; }
        }
        /// <summary>适配器URL</summary>
        [IgnoreDataMember, JsonIgnore]
        public string Url
        {
            get { return GetValueInternal(MetadataConsts.SourceUrl).As<string>(); }
            set { SetValueInternal(value, MetadataConsts.SourceUrl); }
        }
        /// <summary>正式标题</summary>
        [IgnoreDataMember, JsonIgnore]
        public virtual string Title
        {
            get { return GetValueInternal(MetadataConsts.SourceUrl).As<string>(); }
            set { SetValueInternal(value, MetadataConsts.SourceUrl); }
        }
        /// <summary>描述</summary>
        [IgnoreDataMember, JsonIgnore]
        public virtual string Description
        {
            get { throw new NotImplementedException(); }
        }
        /// <summary>创建者</summary>
        [IgnoreDataMember, JsonIgnore]
        public virtual string Creator
        {
            get { throw new NotImplementedException(); }
        }
        /// <summary>创建日期</summary>
        [IgnoreDataMember, JsonIgnore]
        public virtual DateTime? CreatedDate
        {
            get { throw new NotImplementedException(); }
        }
        /// <summary>缩略图</summary>
        [IgnoreDataMember, JsonIgnore]
        public virtual Image Thumbnail
        {
            get { throw new NotImplementedException(); }
        }
        /// <summary>全文</summary>
        [IgnoreDataMember, JsonIgnore]
        public virtual string Fulltext
        {
            get { throw new NotImplementedException(); }
        }
        /// <summary>获得某个元数据值</summary>
        public virtual object GetValue(string key)
        {
            return this.GetValueBy(key);
        }
        /// <summary>转换为索引信息</summary>
        public virtual string ToIndex()
        {
            return this.ToJson();
        }
        /// <summary>生成JSON串</summary>
        public override string ToString()
        {
            return this.ToJson();
        }
        #endregion

        #region 查询修改
        /// <summary>获得某个元数据值</summary>
        protected virtual object GetValueInternal(params string[] keys)
        {
            if (keys.IsNullOrEmpty()) return this;
            object value = this;
            for (int i = 0; i < keys.Length; i++)
            {
                var child = value.As<IDictionary<string, object>>().GetValueBy(keys[i]);
                if (child == null) return null;
                value = child;
            }
            return value;
        }
        /// <summary>设置某个元数据值</summary>
        protected virtual void SetValueInternal(object value, params string[] keys)
        {
            if (keys.IsNullOrEmpty()) return;
            IDictionary<string, object> parent = this;
            for (int i = 0; i < keys.Length - 1; i++)
            {
                var child = parent.GetValueBy(keys[i]).As<IDictionary<string, object>>();
                if (child == null)
                {
                    child = new Dictionary<string, object>();
                    parent.Add(keys[i], child);
                }
                parent = child;
            }
            parent[keys.Last()] = value;
        }
        /// <summary>加入非空值</summary>
        public void AddNonNull(string key, object value)
        {
            if (value == null) return;
            this[key] = value;
        }
        /// <summary>加入非空值</summary>
        public void AddNonNullOrEmpty(string key, object[] values)
        {
            if (values.IsNullOrEmpty()) return;
            if (values.Any(e => e != null))
            {
                this[key] = values;
            }
        }
        /// <summary>加入非空值</summary>
        public void AddNonNullOrEmpty(string key, string value)
        {
            if (value.IsNullOrEmpty()) return;
            this[key] = value;
        }
        /// <summary>加入非空值</summary>
        public void AddNonNullOrEmpty(string key, string[] values)
        {
            if (values == null || values.Length == 0) return;
            if (values.Any(e => !e.IsNullOrEmpty()))
            {
                this[key] = values;
            }
        }
        /// <summary>获得某个元数据值</summary>
        public virtual bool RemoveValue(params string[] keys)
        {
            if (keys.IsNullOrEmpty()) return false;
            IDictionary<string, object> parent = this;
            for (int i = 0; i < keys.Length - 1; i++)
            {
                var child = parent.GetValueBy(keys[i]).As<IDictionary<string, object>>();
                if (child == null) return false;
                parent = child;
            }
            return parent.Remove(keys.Last());
        }
        /// <summary>合并值</summary>
        protected virtual void MergeValue(Metadata other)
        {
            MergeDictionary(this, other);
        }
        /// <summary>合并字典值</summary>
        private static void MergeDictionary(IDictionary<string, object> thisDict, IDictionary<string, object> otherDict)
        {
            foreach (var pair in otherDict)
            {
                var thisValue = thisDict.GetValueBy(pair.Key);
                if (thisValue == null)
                {
                    thisDict.Add(pair.Key, pair.Value);
                    continue;
                }
                var thisDict2 = thisValue as IDictionary<string, object>;
                var otherDict2 = pair.Value as IDictionary<string, object>;
                if (thisDict2 != null && otherDict2 != null)
                {
                    MergeDictionary(thisDict2, otherDict2);
                    continue;
                }
                var thisList2 = thisValue as IList<object>;
                var otherList2 = pair.Value as IList<object>;
                if (thisList2 != null && otherList2 != null)
                {
                    continue;
                }
                thisDict[pair.Key] = pair.Value;
            }
        }
        /// <summary>合并集合值</summary>
        private static void MergeList(IList<object> thisList, IList<object> otherList)
        {
            foreach (var otherValue in otherList)
            {
                if (otherValue == null) continue;
                if (!thisList.Any(e => e.GetType() == otherValue.GetType()))
                {
                    thisList.Add(otherValue);
                    continue;
                }
                //var otherDict2 = otherValue as IDictionary<string, object>;
                //if (otherDict2 != null)
                //{
                //    var thisDict2 = thisValue as IDictionary<string, object>;
                //    MergeDictionary(thisDict2, otherDict2);
                //    continue;
                //}
                //var thisList2 = thisValue as IList<object>;
                //var otherList2 = pair.Value as IList<object>;
                //if (thisList2 != null && otherList2 != null)
                //{
                //    continue;
                //}
                //thisDict[pair.Key] = pair.Value;
            }
        }
        #endregion
    }
}
