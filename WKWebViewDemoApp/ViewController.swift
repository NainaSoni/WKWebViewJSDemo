//
//  ViewController.swift
//  WKWebViewDemoApp
//  
//

import UIKit
import WebKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        let config = WKWebViewConfiguration()
        let userContentController = WKUserContentController()
        userContentController.add(self, name: "BTCAClient") //userContentController.add(self, name: "test")
        

        config.userContentController = userContentController

        /* Inject JavaScript into the webpage.*/
        guard let scriptPath = Bundle.main.path(forResource: "btca", ofType: "js"),
            let scriptSource = try? String(contentsOfFile: scriptPath) else { return }  //let scriptSource = "window.webkit.messageHandlers.test.postMessage(`Hello, world!`);"
        
        let userScript = WKUserScript(source: scriptSource, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        userContentController.addUserScript(userScript)

        
        let webView = WKWebView(frame: .zero, configuration: config)
        view.addSubview(webView)

        let layoutGuide = view.safeAreaLayoutGuide

        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.leadingAnchor.constraint(equalTo: layoutGuide.leadingAnchor).isActive = true
        webView.trailingAnchor.constraint(equalTo: layoutGuide.trailingAnchor).isActive = true
        webView.topAnchor.constraint(equalTo: layoutGuide.topAnchor).isActive = true
        webView.bottomAnchor.constraint(equalTo: layoutGuide.bottomAnchor).isActive = true


        if let url = URL(string: "https://tmo.appnext.tmo.bigtincan.com") {
            webView.load(URLRequest(url: url))
        }
    }
}

extension ViewController: WKScriptMessageHandler {
    // Capture postMessage() calls inside loaded JavaScript from the webpage. Note that a Boolean
    // will be parsed as a 0 for false and 1 for true in the message's body. See WebKit documentation:
    // https://developer.apple.com/documentation/webkit/wkscriptmessage/1417901-body.
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if let messageBody = message.body as? String {
            print(messageBody)
        }
    }
}

