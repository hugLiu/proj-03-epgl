using Jurassic.So.Infrastructure;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Models
{
    public class StreamResult : ActionResult
    {
        // 可被序列化的内容  
        object Data { get; set; }

        // 构造器  
        public StreamResult(object data)
        {
            Data = data;
        }

        // 主要是重写这个方法  
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            HttpResponseBase response = context.HttpContext.Response;

            // 设置 HTTP Header 的 ContentType  
            response.ContentType = "application/octet-stream";

            if (Data != null)
            {
                var stream = this.Data.As<Stream>();
                if (stream == null)
                {
                    var content = this.Data.As<byte[]>();
                    stream = new MemoryStream(content);
                }
                stream.Position = 0;
                response.BinaryWrite(stream.ToByteArray());
            }
        }
    }
}