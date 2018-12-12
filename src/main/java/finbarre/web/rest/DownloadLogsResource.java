package finbarre.web.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import finbarre.storage.WriteLogsToFileService;

/**
 * REST controller for managing downloads.
 */
@RestController
@RequestMapping("/api")
public class DownloadLogsResource {

    private final Logger log = LoggerFactory.getLogger(DownloadLogsResource.class);

    private final WriteLogsToFileService writeLogsToFileService;

    public DownloadLogsResource(WriteLogsToFileService writeLogsToFileService) {
        this.writeLogsToFileService = writeLogsToFileService;
    }


    /**
     * GET  /passus-logs/get-file : get PassusLogs file.
     *
     * @return the ResponseEntity with status 200 (OK)
     */
    @GetMapping("/get-log-file")
    @Timed
    @ResponseBody
    public ResponseEntity<Object> getPassusLogsFile() {
        log.debug("REST request to get PassusLogs file.");
        String fileStr = writeLogsToFileService.getFileStr();
        writeLogsToFileService.writeLogsToFile();
        
        ResponseEntity<Object> respEntity = null;

        File file=new File(fileStr);

        if(file.exists()){
            InputStream inputStream;
			try {
				inputStream = new FileInputStream(fileStr);
//	            String type="text/plain";

	            String type=URLConnection.guessContentTypeFromName(fileStr);

	            byte[] out;
				try {
					out = org.apache.commons.io.IOUtils.toByteArray(inputStream);

		            HttpHeaders responseHeaders = new HttpHeaders();
		            responseHeaders.add("content-disposition", "attachment; filename=" + "logs.txt");
		            responseHeaders.add("Content-Type",type);

		            respEntity = new ResponseEntity<Object>(out, responseHeaders,HttpStatus.OK);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
		            respEntity = new ResponseEntity<Object> ("File Not Found", HttpStatus.OK);
				}
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
	            respEntity = new ResponseEntity<Object> ("File Not Found", HttpStatus.OK);
			}
        }else{
            respEntity = new ResponseEntity<Object> ("File Not Found", HttpStatus.OK);
        }
        return respEntity;
    }
}
