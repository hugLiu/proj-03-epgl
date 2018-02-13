'------------------------------------------------------
'实在没办法，jscript无法使用VARIANT类型和ActiveXObject传递参数，有一些函数只好用VB实现--
'好在全局变量在JS和VBS中都可以使用。---
'
'------------------------------------------------------
'params = {nType, lon0, lat0, lon1, lat1, lon2, lat2, azimuth, k0, x0, y0, Zab}

Function VbsXYToLL(x0, y0)
	On Error Resume Next
	dim x1, y1
	dim g
		g=JoGisRef.UPtoLL(x0, y0)
		VbsXYToLL = g
	If Err Then
		VbsXYToLL = ""
		Exit Function
	End If
End Function