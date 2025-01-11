//
//  BasicPWAApp.swift
//  BasicPWA
//
//  Created by Dimitar Parushev on 10.01.25.
//

import SwiftUI

@main
struct BasicPWAApp: App {
    
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
