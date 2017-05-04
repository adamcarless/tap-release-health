var path = require('path'),
    arg = process.argv.slice(2),
    old_report = require(path.join(__dirname,'../Datasource/DaxReport-'+arg[0])),
    new_report = require(path.join(__dirname,'../Datasource/DaxReport-'+arg[1])),
    oldAppVerisonConfig = require(path.join(__dirname,'../configs/reportConfig-'+arg[0])),
    newAppVerisonConfig = require(path.join(__dirname,'../configs/reportConfig-'+arg[1])),
    exe_report = require('./fetchData');
    
var validate_release = {

  listAllDevices: function (report) {
    var device_map = {},
        interval = this.getReportInterval(report);
    this.normaliseReport(report).forEach(function(device){
      var temp_arr = [],
          temp_device = device.c
      if(temp_device[2] == interval) {
        temp_arr.push(temp_device[1]);
        temp_arr.push(temp_device[3]);
        device_map[temp_device[0]] = temp_arr;
      }
    })
    return device_map;
  },

  compareReport: function () {
    if (process.argv.length < 4){
      throw new Error('This is not an error. This is just to abort javascript');
      return false;
    }
    var filtered_new_report = this.listAllDevices(new_report);
    var filtered_old_report = this.listAllDevices(old_report);
    // normalise_report(old_report).forEach(function(device){
    //   if(old_report.hasOwnProperty(device))
    //   console.log(Keys(device))
    // })

    console.log(`New devices ${Object.keys(filtered_new_report).length}`);
    console.log(`Old devices ${Object.keys(filtered_old_report).length}`);

    Object.keys(filtered_old_report).forEach(function(device){
      if (!filtered_new_report.hasOwnProperty(device)){
        console.log(`Device not exists in ${filtered_old_report[device]} :: ${device}`);
      }
    })
  },

  getReportInterval: function (report_name) {
    return (report_name === 'old_report') ?
    parseInt(oldAppVerisonConfig.deployment_time) - 1 : parseInt(newAppVerisonConfig.deployment_time) + 1;
  },

  normaliseReport: function (report) {
    return report.reportitems.reportitem.pop().rows.r
  }
}

validate_release.compareReport();
