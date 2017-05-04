var path = require('path'),
    dax = require('node-dax'),
    fs = require('fs'),
    reportConfig = require(path.join(__dirname,'../configs/reportConfigTemplate'));
dax.logger.enabled = false;

var NL = '\n';
var TAB = '\t';

if (process.argv.length < 6){
  throw new Error('This is not an error. This is just to abort javascript');
  return false;
}

var startDate = process.argv.slice(2)[0],
    endDate = process.argv.slice(2)[1],
    bucket = reportConfig.bucket,
    client = reportConfig.client,
    app_version = process.argv.slice(2)[2],
    reportID = reportConfig.reportID;

    parameters = reportConfig.parameters;
    parameters["app_version"]= app_version;
    reportConfig["startDate"] = startDate;
    reportConfig["endDate"] = endDate;
    reportConfig["deployment_time"] = process.argv.slice(2)[3];

fs.writeFile(path.join(__dirname,'../configs/reportConfig-'+app_version+'.json'),JSON.stringify(reportConfig, null));

var reportRequest = dax.requestBuilder(reportID, parameters, bucket, client, startDate, endDate);

console.info('Report Request:', reportRequest, NL);

dax.fetchReportNow('demo', reportRequest).then(function(result) {
    fs.writeFile(path.join(__dirname,'../Datasource/DaxReport-'+app_version+'.json'),JSON.stringify(result, null));
}).catch(function(error) {
    console.error('Error', error, error.data);
});
