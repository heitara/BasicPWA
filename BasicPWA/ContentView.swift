//
//  ContentView.swift
//  BasicPWA
//
//  Created by Dimitar Parushev on 10.01.25.
//

import SwiftUI
import WebKit

struct ContentView: View {
    var body: some View {
        VStack {
            WebView(url: URL(string: "http://localhost:22223/index.html")!)
        }
    }
}

#Preview {
    ContentView()
}
