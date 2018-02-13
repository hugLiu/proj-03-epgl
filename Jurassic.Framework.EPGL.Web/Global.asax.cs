using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using Jurassic.So.Infrastructure;
using Ninject;
using Ninject.Web.Common;
using Jurassic.CommonModels.EFProvider;
using Jurassic.WebFrame;
using Jurassic.EPGL.Database;
using Jurassic.EPGL.DataService.Service;
using Jurassic.EPGL.Database.Service;
using Jurassic.EPGL.Database.Service.Implement;
using Jurassic.EPGL.DataService.Service.Implement;
using Jurassic.PKS.Service.Search;
using Jurassic.So.Search.Mongo;

namespace Jurassic.Framework.EPGL.Web
{
    public class Application1 : MvcApplication
    {
        protected override IEnumerable<string> ControllerNameSpaces
        {
            get
            {
                var list = base.ControllerNameSpaces.ToList();
                //声明自身Controller所在的命名空间
                list.Insert(0, typeof(Application1).Namespace + ".Controllers");
                return list;
            }
        }

        protected override void Application_Start()
        {
            base.Application_Start();

            //Todo: 额外的初始化代码
            AutoMapperUtil.LoadConfig();
        }

        /// <summary>
        /// 加入注入服务绑定
        /// </summary>
        protected override void AddBindings(IKernel ninjectKernel)
        {
            base.AddBindings(ninjectKernel);

            //要支持Oralce数据库，请在""中填写Oralce库的Schema名称
            ninjectKernel.Rebind<ModelContext>().ToSelf()
            .WithPropertyValue("Schema", "SYSFRAME");

            //针对API
            ninjectKernel.Rebind<GtApiDbContext>().ToSelf()
            .WithPropertyValue("Schema", "GTAPI");

            //针对项目
            ninjectKernel.Rebind<AppDataDbContext>().ToSelf()
            .WithPropertyValue("Schema", "APPDATA");

            //针对项目
            ninjectKernel.Rebind<GFDbContext>().ToSelf()
            .WithPropertyValue("Schema", "GETFEATURE");

            //针对项目
            ninjectKernel.Rebind<UserDataDbContext>().ToSelf()
            .WithPropertyValue("Schema", "USERDATA");

            //针对项目
            ninjectKernel.Rebind<GMSDbContext>().ToSelf()
           .WithPropertyValue("Schema", "GEOMAPSERVER");

            //如果要修改上传根目录，请恢复以下代码,并修改第二个参数
            //ninjectKernel.Rebind<IFileLocator>().To(typeof(FileLocator))
            //       .WithConstructorArgument("rootPath", "D:\\Temp"); 

            //如果要开启多标签，或修改默认皮肤，请恢复以下代码,并修改第二个参数
            //ninjectKernel.Rebind<UserConfig>().ToSelf()
            //.WithPropertyValue("ShowTab", false) //如果需要系统默认以多标签形式显示页，请设置为true
            //.WithPropertyValue("Theme", "blue");  //系统默认皮肤

            //Todo: 额外的注入代码 
            //ninjectKernel.Bind<GtApiDbContext>().To<GeoDbContext>().InRequestScope();  
            ninjectKernel.Bind<IAPI_AUTH_TOKENRepository>().To<API_AUTH_TOKENRepository>();
            ninjectKernel.Bind<IAPI_AUTH_TOKENService>().To<API_AUTH_TOKENService>();

            ninjectKernel.Bind<IAPPDATAMODELRepository>().To<APPDATAMODELRepository>();
            ninjectKernel.Bind<IAPPDATAMODELService>().To<APPDATAMODELService>();

            ninjectKernel.Bind<IJoinTableCommonService>().To<JoinTableCommonService>();

            ninjectKernel.Bind<IThematicMapService>().To<ThematicMapService>();

            ninjectKernel.Bind<IGF_BORepository>().To<GF_BORepository>();
            ninjectKernel.Bind<IGFService>().To<GFService>();

            ninjectKernel.Bind<IUSERBEHAVIORRepository>().To<USERBEHAVIORRepository>();
            ninjectKernel.Bind<IUSERBEHAVIORService>().To<USERBEHAVIORService>();

            ninjectKernel.Bind<IFAVORITECATALOGRepository>().To<FAVORITECATALOGRepository>();
            ninjectKernel.Bind<IFAVORITECATALOGService>().To<FAVORITECATALOGService>();

            ninjectKernel.Bind<IGEOLOGYSERIESRepository>().To<GEOLOGYSERIESRepository>();
            ninjectKernel.Bind<IUserDataService>().To<UserDataService>();

            ninjectKernel.Bind<IGEOSERIESCLASSRepository>().To<GEOSERIESCLASSRepository>();
            //ninjectKernel.Bind<IUSERBEHAVIORService>().To<USERBEHAVIORService>();

            ninjectKernel.Bind<IMiningChartService>().To<MiningChartService>();

            ninjectKernel.Bind<ITARGETSTYLEUSERCONFIGRepository>().To<TARGETSTYLEUSERCONFIGRepository>();
            ninjectKernel.Bind<ISEARCHHISTORYRepository>().To<SEARCHHISTORYRepository>();

            ninjectKernel.Bind<IAPPDPROFILETEMPLATERepository>().To<APPDPROFILETEMPLATERepository>();
            ninjectKernel.Bind<IAPPDATAPROFILERepository>().To<APPDATAPROFILERepository>();

            ninjectKernel.Bind<IQuery>().To<MongoSearch>();

            ninjectKernel.Bind<IGMSService>().To<GMSService>();
        }
    }
}
