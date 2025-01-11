//
//  ContentView.swift
//  BasicPWA macOS
//
//  Created by Dimitar Parushev on 10.01.25.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            let url = URL(string: "http://localhost:33732/index.html")!
            let _ = print(url.absoluteString)
            WebView(url: url)
        }
    }
}

#Preview {
    ContentView()
}
