using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace Jurassic.Framework.EPGL.Web
{
    /// <summary>
    /// OpenlayerProxy 的摘要说明
    /// </summary>
    public class OpenlayerProxy : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            if (string.IsNullOrEmpty(context.Request["url"])) return;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(context.Request["url"]);
                request.UserAgent = context.Request.UserAgent;
                request.ContentType = context.Request.ContentType;
                request.Method = context.Request.HttpMethod;
                
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream imgstream = response.GetResponseStream();
                System.Drawing.Image img = System.Drawing.Image.FromStream(imgstream);
                MemoryStream ms = new MemoryStream();
                img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

                context.Response.ContentType = response.ContentType;
                context.Response.BinaryWrite(ms.ToArray());

                response.Close();
                imgstream.Close();
                ms.Close();
            }
            catch (WebException err) {
                var errresponse = err.Response as HttpWebResponse;
                context.Response.StatusCode = errresponse.StatusCode.GetHashCode();
                context.Response.StatusDescription = err.Message;
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}