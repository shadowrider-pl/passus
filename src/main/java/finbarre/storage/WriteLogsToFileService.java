package finbarre.storage;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import finbarre.domain.PassusLog;
import finbarre.service.impl.PassusLogServiceImpl;

@Service
public class WriteLogsToFileService {

	private final Logger log = LoggerFactory.getLogger(WriteLogsToFileService.class);

	private final PassusLogServiceImpl passusLogServiceImpl;
	String fileStr = "download-dir/logs.txt";

	public String getFileStr() {
		return fileStr;
	}

	public WriteLogsToFileService(PassusLogServiceImpl passusLogServiceImpl) {
		this.passusLogServiceImpl = passusLogServiceImpl;
	}

	public void writeLogsToFile() {
		log.debug("Request to write logss to file");
		List<PassusLog> logs = passusLogServiceImpl.findAll();
		Path filePath = Paths.get(fileStr);
//		Files file = new Files(Paths.get(fileStr));
        if(!Files.exists(filePath)) {
        	try {
        		Files.createFile(Paths.get(fileStr));
    		} catch (IOException e) {
    			e.printStackTrace();
    		}
        } else {
    		try {
				Files.delete(filePath);
        		Files.createFile(Paths.get(fileStr));
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
		try (PrintWriter printWriter = new PrintWriter(fileStr)) {
			for (PassusLog log : logs) {
				String logString = log.getTime() + ";" + log.getName() + ";" + log.getValue();
				printWriter.write(logString);
			}
			printWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
