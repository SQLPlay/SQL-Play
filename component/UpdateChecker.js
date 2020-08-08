import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import pkginfo from '../package.json'

export default function UpdateChecker() {
    return (
        <View>
            <Text>{pkginfo.version}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
