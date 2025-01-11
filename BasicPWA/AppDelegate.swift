//
//  AppDelegate.swift
//  BasicPWA
//
//  Created by Dimitar Parushev on 11.01.25.
//

import UIKit
import GCDWebServer
import WebKit

class AppDelegate: UIResponder, UIApplicationDelegate {
    let webServer = GCDWebServer()
    let webView = WKWebView()
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        let subdir = Bundle.main.resourceURL!.appendingPathComponent("").path
        //        webServer.addGETHandler(forBasePath: "/", directoryPath: subdir, indexFilename: "index.html", cacheAge: 0, allowRangeRequests: true)
        webServer.addHandler(match: { (requestMethod, fullAddress, requestHeaders, urlPath, urlQuery) -> GCDWebServerRequest? in
            
            if requestMethod == "POST" {
                return GCDWebServerDataRequest(method: requestMethod, url: fullAddress, headers: requestHeaders, path: urlPath, query: urlQuery)
            }
            
            return GCDWebServerRequest(method: requestMethod, url: fullAddress, headers: requestHeaders, path: urlPath, query: urlQuery)
        }) { [weak self] (request, completionBlock) in
            var response: GCDWebServerResponse?
            if request.url.absoluteString == "http://localhost:22223/todos/1" {
                DispatchQueue.main.async {
                    self?.webView.evaluateJavaScript("getResponse3();"
                    ) { (result, error) in
                        print(result, error)
                    }
                }
            }
            guard let directoryPath = Bundle.main.resourceURL?.path else {
                completionBlock(GCDWebServerResponse(statusCode: GCDWebServerClientErrorHTTPStatusCode.httpStatusCode_NotFound.rawValue))
                return
            }
            let localPath: String = String(request.path)
            let filePath:String = directoryPath+localPath
            let fileAttributes = try?  FileManager.default.attributesOfItem(atPath:filePath)
            if let fileType = fileAttributes?[.type] as? FileAttributeType {
                if fileType == .typeDirectory {
                    print("It's a folder - TBD, we don't handle folders")
                } else if fileType == .typeRegular {
                    response = GCDWebServerFileResponse(file: filePath, byteRange: request.byteRange)
                    response?.setValue("bytes", forAdditionalHeader: "Accept-Ranges")
                }
            }
            if response != nil {
                response?.cacheControlMaxAge = 0;
            } else {
                response = GCDWebServerResponse(statusCode: GCDWebServerClientErrorHTTPStatusCode.httpStatusCode_NotFound.rawValue)
            }
            completionBlock(response)
            
        }
        webServer.start(withPort: 22223, bonjourName: "GCD Web Server")
        webView.load(URLRequest(url: URL(string: "http://localhost:22223/index.html")!))
        webView.isInspectable = true
        return true
    }
    // ...
}
