using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class FileInfoController : Controller
    {
        WebServiceController Service = new WebServiceController();

        /// <summary>
        /// 下载方法
        /// </summary>
        /// <param name="id"></param>
        /// <param name="title"></param>
        /// <param name="url"></param>
        /// <param name="ticket"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public ActionResult DownLoad(string id, string title, string url, string ticket, string format, string name)
        {
            title = System.Web.HttpUtility.UrlDecode(title ?? "");
            url = System.Web.HttpUtility.UrlDecode(url);
            ticket = System.Web.HttpUtility.UrlDecode(ticket);
            format = System.Web.HttpUtility.UrlDecode(format);
            name = System.Web.HttpUtility.UrlDecode(name);
            var content = new Dictionary<string, string>();
            content["id"] = id;
            content["title"] = title;
            content["url"] = url;
            content["ticket"] = ticket;
            content["name"] = name;
            //DataFormat fileFormat = (DataFormat)System.Enum.Parse(typeof(DataFormat), format.ToUpper());
            return Service.GetDataEntity(url, ticket, format, name);
        }

        public ActionResult SaveDataUrl(string id, string title, string url, string ticket, string format, string name)
        {
            title = System.Web.HttpUtility.UrlDecode(title ?? "");
            url = System.Web.HttpUtility.UrlDecode(url);
            ticket = System.Web.HttpUtility.UrlDecode(ticket);
            format = System.Web.HttpUtility.UrlDecode(format);
            name = System.Web.HttpUtility.UrlDecode(name);
            var content = new Dictionary<string, string>();
            content["id"] = id;
            content["title"] = title;
            content["url"] = url;
            content["ticket"] = ticket;
            content["name"] = name;
            //DataFormat fileFormat = (DataFormat)System.Enum.Parse(typeof(DataFormat), format.ToUpper());
            var relativeUrl = Service.GetDataEntity2(url, ticket, format, name);

            return Json(relativeUrl, JsonRequestBehavior.AllowGet);
        }
    }
}