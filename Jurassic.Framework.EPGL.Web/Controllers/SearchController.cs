using Jurassic.AppCenter;
using Jurassic.EPGL.DataService.Models;
using Jurassic.EPGL.DataService.Service;
using Jurassic.WebFrame;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class SearchController : BaseController
    {
        [LoginAuthorize]
        public ActionResult Index(string searchKey)
        {
            ViewBag.Bag = searchKey;
            ViewBag.UserId = CurrentUser.Id;
            ViewBag.ActiveTab = "Search";

            return View();
        }        
    }
}