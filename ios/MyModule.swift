//
//  MyModule.swift
//  SqlPlay
//
//  Created by Shivam Kumar on 05/04/23.
//

import Foundation

@objc(MyModule)
class MyModule: NSObject, RCTBridgeModule {
  static func moduleName() -> String! {
    return "MyModule"
  }

  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  func constantsToExport() -> [AnyHashable : Any]! {
    return ["MY_CONSTANT": "Hello, World!"]
  }

  @objc(myMethod:withCallback:)
  func myMethod(_ value: String, callback: RCTResponseSenderBlock) -> Void {
    callback([NSNull(), "You passed in " + value])
  }
}

