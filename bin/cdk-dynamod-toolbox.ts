#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkDynamodToolboxStack } from '../lib/cdk-dynamod-toolbox-stack';

const app = new cdk.App();
new CdkDynamodToolboxStack(app, 'CdkDynamodToolboxStack', {});