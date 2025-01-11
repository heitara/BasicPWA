//
//  AppDelegate.swift
//  BasicPWA
//
//  Created by Dimitar Parushev on 10.01.25.
//
import SwiftUI
import GCDWebServer

class AppDelegate: NSObject, NSApplicationDelegate {
    let webServer = GCDWebServer()
    
    func applicationWillFinishLaunching(_ notification: Notification) {
        let subdir = Bundle.main.resourceURL!.appendingPathComponent("").path
        webServer.addGETHandler(forBasePath: "/", directoryPath: subdir, indexFilename: "index.html", cacheAge: 0, allowRangeRequests: true)
        webServer.start(withPort: 33732, bonjourName: "GCD Web Server")
    }
}
