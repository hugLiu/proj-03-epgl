using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class ExploreController : Controller
    {
        // GET: Explore
        public ActionResult Index()
        {
            ViewBag.ActiveTab = "Explore";
            return View();
        }
    }
}