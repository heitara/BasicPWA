//
//  BasicPWA_macOSApp.swift
//  BasicPWA macOS
//
//  Created by Dimitar Parushev on 10.01.25.
//

import SwiftUI

@main
struct BasicPWA_macOSApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
