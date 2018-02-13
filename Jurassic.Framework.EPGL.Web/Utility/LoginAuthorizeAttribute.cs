using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Jurassic.WebFrame;

namespace Jurassic.Framework.EPGL.Web
{
    public class LoginAuthorizeAttribute : AuthorizeAttribute
    {
        private static string ssss { get; set; }
        /// <summary>  
        /// 判断用户是否登录成功  
        /// 登录成功返回true，否者返回false  
        /// 返回false将读取web.config中的loginUrl跳转到登录页面  
        /// </summary>  
        /// <param name="httpContext"></param>  
        /// <returns></returns>  
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            var isAuthorized = false;
            if (httpContext != null && httpContext.Session != null)
            {
                if (!string.IsNullOrEmpty(httpContext.User.Identity.Name))
                {
                    isAuthorized = true;
                }
            }
            return isAuthorized;
        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);
        }
    }
}