import { Stack, StackProps } from "aws-cdk-lib";
import * as api from "aws-cdk-lib/aws-apigateway";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Function } from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import path = require("path");
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam'
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";


export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    
    const sourceBucket: Bucket = new s3.Bucket(this, "image_source_bucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });
    
    const cloudfrontdist: Distribution = new cloudfront.Distribution(this, "cfDist", {
      defaultBehavior: {
        origin: new origins.S3Origin(sourceBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL
      }
    });
    const cloudfrontOAI: OriginAccessIdentity = new cloudfront.OriginAccessIdentity(
      this, 'CloudFrontOriginAccessIdentity');
  
      sourceBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [sourceBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(
          cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
  }));
    
  }
}
// new cdk.CfnOutput(this, 'cloudfronturl', {
  //   value: `https://${cloudfrontdist.distributionDomainName}`,
  // });
  
  // const imageHandler: Function = new lambda.Function(this, "imageHandler", {
  //   runtime: lambda.Runtime.NODEJS_16_X,
  //   code: lambda.Code.fromAsset("lambda"),
  //   handler: "imageHandler.handler",
  //   environment: {
  //     DEFAULT_FALLBACK_IMAGE_BUCKET: "",
  //     ENABLE_DEFAULT_FALLBACK_IMAGE: "No",
  //     ENABLE_SIGNATURE: "No",
  //     DEFAULT_FALLBACK_IMAGE_KEY: "",
  //     SECRET_KEY: "",
  //     REWRITE_SUBSTITUTION: "",
  //     REWRITE_MATCH_PATTERN: "",
  //     SOURCE_BUCKETS: `${sourceBucket.bucketName}`,
  //     AUTO_WEBP: "No",
  //     CORS_ENABLED: "Yes",
  //     CORS_ORIGIN: "*",
  //     SECRETS_MANAGER: "",
  //   },
  // });

  // const apiGateway = new api.RestApi(this, "apiGateway")
  // apiGateway.root.addMethod('ANY', new api.LambdaIntegration(imageHandler), {
  //   apiKeyRequired: false,
  //   authorizationType: api.AuthorizationType.NONE
  // });