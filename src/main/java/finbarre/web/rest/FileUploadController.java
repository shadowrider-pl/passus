package finbarre.web.rest;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.codahale.metrics.annotation.Timed;

import finbarre.storage.FileSystemStorageService;
import finbarre.storage.StorageFileNotFoundException;
import finbarre.web.rest.util.HeaderUtil;



@Controller
@RequestMapping("/api")
public class FileUploadController {

    private final FileSystemStorageService storageService;

	private final Logger log = LoggerFactory.getLogger(ConvertLogResource.class);

    @Autowired
    public FileUploadController(FileSystemStorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * DELETE  /log-files/:file : delete the file.
     *
     * @param file the file of the file to delete
     * @return the ResponseEntity with status 200 (OK)
     * @throws IOException 
     */
    @DeleteMapping("/log-files/{file}")
    @Timed
    public ResponseEntity<Void> deletePassusLog(@PathVariable String file) throws IOException {
        log.debug("REST request to delete PassusLog : {}", file);
        final String filename = file;
        storageService.delete(file);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("sendFileToServer", filename)).build();
    }

    @GetMapping("/log-files")
    @Timed
	public  ResponseEntity<List<String>> getListFiles() {
		log.debug("REST request to get all files.");
        List<String> fileNames = storageService.loadAll().map(
                path -> MvcUriComponentsBuilder.fromMethodName(FileUploadController.class,
                        "getFile", path.getFileName().toString()).build().toString())
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(fileNames);
    }
    
   	@GetMapping("/log-files/{filename:.+}")
   	@ResponseBody
   	public ResponseEntity<Resource> getFile(@PathVariable String filename) {
		log.debug("REST request to get file : {}", filename);
   		Resource file = storageService.loadAsResource(filename);
   		return ResponseEntity.ok()
   				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
   				.body(file);
   	}

    @PostMapping("/log-files")
    public String handleFileUpload(@RequestParam("file") MultipartFile file,
            RedirectAttributes redirectAttributes) {

		log.debug("REST request to upload file : {}", file.getOriginalFilename());
        storageService.store(file);
        redirectAttributes.addFlashAttribute("message",
                "You successfully uploaded " + file.getOriginalFilename() + "!");

        return "redirect:/";
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }

}
