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
import org.springframework.web.bind.annotation.PathVariable;
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
     * @throws IOException 
     */
    @GetMapping("/get-log-file")
    @Timed
    @ResponseBody
    public ResponseEntity<Object> getPassusLogsFile() throws IOException {
        log.debug("REST request to get PassusLogs file.");
        String destinationFileName = "logs.txt";
        String sourceFileName = null;
        boolean convert = false;
        ResponseEntity<Object> respEntity = writeLogsToFileService.prepareFileToDownload(sourceFileName, destinationFileName, convert);
        
        return respEntity;
    }
}
