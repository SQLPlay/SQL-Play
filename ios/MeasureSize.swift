import Foundation
import UIKit
import React

@objc(MeasureSize)
class MeasureSize: NSObject, RCTBridgeModule {
    
    static func moduleName() -> String! {
        return "MeasureSize"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    func measureSize(_ text: String, font: String, size: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        let font = UIFont(name: font, size: CGFloat(size)) ?? UIFont.systemFont(ofSize: CGFloat(size))
        let width = (text as NSString).size(withAttributes: [.font: font]).width
        resolve(width)
    }
}
