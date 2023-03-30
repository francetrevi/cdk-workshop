#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';

const app = new cdk.App();
const env = { account: "289193425521", region: "eu-central-1" }

new CdkWorkshopStack(app, 'CdkWorkshopStackF', {
    env: env
});
