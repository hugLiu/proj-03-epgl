using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Jurassic.Framework.EPGL.Web.Models
{
    /// <summary>
    /// HTTP应答内容类型常量
    /// </summary>
    public static class MimeTypeConst
    {
        /// <summary>流</summary>
        public const string Stream = "application/octet-stream";
        /// <summary>DOC</summary>
        public const string DOC = "application/msword";
        /// <summary>DOCX</summary>
        public const string DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        /// <summary>PPT</summary>
        public const string PPT = "application/vnd.ms-powerpoint";
        /// <summary>PPTX</summary>
        public const string PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        /// <summary>XLS</summary>
        public const string XLS = "application/vnd.ms-excel";
        /// <summary>XLSX</summary>
        public const string XLSX = "pplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        /// <summary>PDF</summary>
        public const string PDF = "application/pdf";
        /// <summary>HTML</summary>
        public const string HTML = "text/html";
        /// <summary>TEXT</summary>
        public const string TEXT = "text/plain";
        /// <summary>XML</summary>
        public const string XML = "text/xml";
        /// <summary>PNG</summary>
        public const string PNG = "image/png";
        /// <summary>JPG</summary>
        public const string JPG = "image/jpeg";
        /// <summary>BMP</summary>
        public const string BMP = "image/bmp";
        /// <summary>TIF</summary>
        public const string TIF = "image/tiff";
        /// <summary>GIF</summary>
        public const string GIF = "image/gif";
        /// <summary>ICON</summary>
        public const string ICON = "image/x-icon";
        /// <summary>JSON</summary>
        public const string JSON = "application/json";
        /// <summary>GDB</summary>
        public const string GDB = "application/jurassic-gdb";
        /// <summary>GDBX</summary>
        public const string GDBX = "application/jurassic-gdbx";
        /// <summary>3GX</summary>
        public const string _3GX = "application/jurassic-3gx";
        /// <summary>数据集</summary>
        public const string DataSet = "application/jurassic-dataset+json";
        /// <summary>Url</summary>
        public const string Url = "application/jurassic-url";
        /// <summary>异常</summary>
        public const string Exception = "application/jurassic-exception+json";

    }
}