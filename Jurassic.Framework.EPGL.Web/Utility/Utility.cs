using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;

namespace Jurassic.Framework.EPGL.Web.Utility
{
    public static class Utility
    {
        /// <summary>
        /// 生成流
        /// </summary>
        /// <param name="xdoc"></param>
        /// <returns></returns>
        public static Stream ToStream(this XmlDocument xdoc)
        {
            var memoryStream = new MemoryStream();
            xdoc.Save(memoryStream);
            return memoryStream;
        }
    }
}