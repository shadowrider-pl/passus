package finbarre.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import finbarre.domain.PassusLog;
import finbarre.service.PassusLogService;
import finbarre.web.rest.PassusLogResource;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Component
@Service
public class FileSystemStorageService implements StorageService {

	private final Path rootLocation;

	private final Logger log = LoggerFactory.getLogger(FileSystemStorageService.class);
	private final PassusLogService passusLogService;
	boolean passed = true;

	@Autowired
	public FileSystemStorageService(StorageProperties properties, PassusLogService passusLogService) {
		this.rootLocation = Paths.get(properties.getLocation());
		this.passusLogService = passusLogService;
	}

	@Override
	public void store(MultipartFile file) {
		try {
			if (file.isEmpty()) {
				throw new StorageException("Failed to store empty file " + file.getOriginalFilename());
			}
			Files.copy(file.getInputStream(), this.rootLocation.resolve(file.getOriginalFilename()));
		} catch (IOException e) {
			throw new StorageException("Failed to store file " + file.getOriginalFilename(), e);
		}
	}

	@Override
	public Stream<Path> loadAll() {
		try {
			return Files.walk(this.rootLocation, 1).filter(path -> !path.equals(this.rootLocation))
					.map(path -> this.rootLocation.relativize(path));
		} catch (IOException e) {
			throw new StorageException("Failed to read stored files", e);
		}

	}

	@Override
	public Path load(String filename) {
		return rootLocation.resolve(filename);
	}

	@Override
	public Resource loadAsResource(String filename) {
		try {
			Path file = load(filename);
			Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new StorageFileNotFoundException("Could not read file: " + filename);

			}
		} catch (MalformedURLException e) {
			throw new StorageFileNotFoundException("Could not read file: " + filename, e);
		}
	}

	@Override
	public void deleteAll() {
		FileSystemUtils.deleteRecursively(rootLocation.toFile());
	}

	@Override
	public void init() {
		try {
			Files.createDirectory(rootLocation);
		} catch (IOException e) {
			throw new StorageException("Could not initialize storage", e);
		}
	}

	public void delete(String file) throws IOException {

		file = "upload-dir/" + file;

		Path fileToDeletePath = Paths.get(file);
		Files.delete(fileToDeletePath);
	}

	public boolean addLogsFromFile(String file) throws IOException, URISyntaxException {

		log.debug("Request to add logs from file : {}", file);

		List<PassusLog> readLogsFromFile = readLogsFromFile(file);
		for (PassusLog log : readLogsFromFile) {
			passusLogService.save(log);
		}
		return passed;
	}

	public List<PassusLog> readLogsFromFile(String file) throws IOException {
		file = "upload-dir/" + file;
		Path filePath = Paths.get(file);
		List<String> logLines = Files.readAllLines(filePath);
		List<PassusLog> logsRead = new ArrayList<>();
		for (String line : logLines) {
			String[] fields = line.split(";");
			PassusLog passusLog = new PassusLog();

			try {
				ZoneId timeZone = ZoneId.systemDefault();

				ZonedDateTime time = LocalDateTime.parse(fields[0], DateTimeFormatter.ISO_DATE_TIME).atZone(timeZone);
				passusLog.setTime(time);
				passusLog.setName(fields[1]);
				passusLog.setValue(fields[2]);
				logsRead.add(passusLog);
			} catch (DateTimeParseException e) {
				passed = false;
				log.debug("DateTimeParseException ocurred");
			}
		}
		return logsRead;
	}
}
