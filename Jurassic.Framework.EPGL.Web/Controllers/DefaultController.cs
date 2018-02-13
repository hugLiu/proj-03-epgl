using Jurassic.WebFrame;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jurassic.Framework.EPGL.Web.Controllers
{
    public class DefaultController : BaseController
    {
        [LoginAuthorize]
        public ActionResult GetUserName()
        {
            var userName = CurrentUser.Name;
            return Json(userName,JsonRequestBehavior.AllowGet);
        }
    }
}