//
//  MeasureSize.m
//  SqlPlay
//
//  Created by Shivam Kumar on 05/04/23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MeasureSize, NSObject)

RCT_EXTERN_METHOD(measureSize: (NSString *)text font:(NSString *)font size:(NSInteger)size resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end

