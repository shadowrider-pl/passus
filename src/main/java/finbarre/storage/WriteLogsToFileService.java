package finbarre.storage;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import finbarre.domain.PassusLog;
import finbarre.service.impl.ConvertLog;
import finbarre.service.impl.PassusLogServiceImpl;

@Service
public class WriteLogsToFileService {

	private final Logger log = LoggerFactory.getLogger(WriteLogsToFileService.class);

	private final PassusLogServiceImpl passusLogServiceImpl;
	private final FileSystemStorageService fileSystemStorageService;
//	String destinationFileName = "download-dir/logs.txt";

//	public String getdestinationFileName() {
//		return destinationFileName;
//	}

	public WriteLogsToFileService(PassusLogServiceImpl passusLogServiceImpl,
			FileSystemStorageService fileSystemStorageService) {
		this.passusLogServiceImpl = passusLogServiceImpl;
		this.fileSystemStorageService = fileSystemStorageService;
	}

	public ResponseEntity<Object> prepareFileToDownload(String sourceFileName, String destinationFileName,
			boolean convert) throws IOException {

		List<PassusLog> logs = getLogs(sourceFileName);

		if (convert) {
			ConvertLog convertLog = new ConvertLog();
			for (PassusLog log : logs) {
				log = convertLog.convertStatus(log);
			}
		}
		ResponseEntity<Object> respEntity = null;

		File file = writeLogsToFile(destinationFileName, logs);

		if (file.exists()) {
			InputStream inputStream;
			try {
				inputStream = new FileInputStream(destinationFileName);
//	            String type="text/plain";

				String type = URLConnection.guessContentTypeFromName(destinationFileName);

				byte[] out;
				try {
					out = org.apache.commons.io.IOUtils.toByteArray(inputStream);

					HttpHeaders responseHeaders = new HttpHeaders();
					responseHeaders.add("content-disposition", "attachment; filename=" + destinationFileName);
					responseHeaders.add("Content-Type", type);

					respEntity = new ResponseEntity<Object>(out, responseHeaders, HttpStatus.OK);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					respEntity = new ResponseEntity<Object>("File Not Found", HttpStatus.OK);
				}
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				respEntity = new ResponseEntity<Object>("File Not Found", HttpStatus.OK);
			}
		} else {
			respEntity = new ResponseEntity<Object>("File Not Found", HttpStatus.OK);
		}

		return respEntity;
	}

	public File writeLogsToFile(String destinationFileName, List<PassusLog> logs) {
		log.debug("Request to write logss to file");
		File file = new File(destinationFileName);
		Path filePath = Paths.get(destinationFileName);
		if (!Files.exists(filePath)) {
			try {
				Files.createFile(Paths.get(destinationFileName));
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			try {
				Files.delete(filePath);
				Files.createFile(Paths.get(destinationFileName));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		try (PrintWriter printWriter = new PrintWriter(destinationFileName)) {
			for (PassusLog log : logs) {
				String logString = log.getTime() + ";" + log.getName() + ";" + log.getValue();
				printWriter.println(logString);
			}
			printWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return file;
	}

	public List<PassusLog> getLogs(String sourceFileName) throws IOException {
		List<PassusLog> logs = new ArrayList<>();
		if (sourceFileName == null) {
			logs = passusLogServiceImpl.findAll();
		} else {
			logs = fileSystemStorageService.readLogsFromFile(sourceFileName);
		}
		return logs;

	}
}
