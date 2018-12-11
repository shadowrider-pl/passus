package finbarre.web.rest;

import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import finbarre.storage.FileSystemStorageService;
import finbarre.storage.StorageFileNotFoundException;
import finbarre.storage.StorageService;
import finbarre.domain.PassusLog;
import finbarre.repository.PassusLogRepository;
import finbarre.service.PassusLogService;
import finbarre.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static finbarre.web.rest.TestUtil.sameInstant;
import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import finbarre.PassusApp;

import finbarre.domain.PassusLog;
import finbarre.repository.PassusLogRepository;
import finbarre.service.PassusLogService;
import finbarre.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static finbarre.web.rest.TestUtil.sameInstant;
import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PassusLogResource REST controller.
 *
 * @see PassusLogResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class FileUploadTests {

	private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
	private static final ZonedDateTime UPDATED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

	private static final String DEFAULT_NAME = "AAAAAAAAAA";
	private static final String UPDATED_NAME = "BBBBBBBBBB";

	private static final String DEFAULT_VALUE = "AAAAAAAAAA";
	private static final String UPDATED_VALUE = "BBBBBBBBBB";

	@Autowired
	private PassusLogRepository passusLogRepository;

	@Autowired
	private PassusLogService passusLogService;

	@Autowired
	private MappingJackson2HttpMessageConverter jacksonMessageConverter;

	@Autowired
	private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

	@Autowired
	private ExceptionTranslator exceptionTranslator;

	@MockBean
	private FileSystemStorageService storageService;

	private MockMvc mvc;

	private PassusLog passusLog;

	@Before
	public void setup() {
		MockitoAnnotations.initMocks(this);
		final FileUploadController fileUploadController = new FileUploadController(storageService);
		this.mvc = MockMvcBuilders.standaloneSetup(fileUploadController)
				.setCustomArgumentResolvers(pageableArgumentResolver).setControllerAdvice(exceptionTranslator)
				.setConversionService(createFormattingConversionService()).setMessageConverters(jacksonMessageConverter)
				.build();
	}


	 @Test
	    public void shouldListAllFiles() throws Exception {
	        given(this.storageService.loadAll())
	                .willReturn(Stream.of(Paths.get("first.txt"), Paths.get("second.txt")));

	        this.mvc.perform(get("/api/log-files")).andExpect(status().isOk())
	                .andExpect(model().attribute("files",
	                        Matchers.contains("http://localhost:8080/api/log-files/first.txt",
	                                "http://localhost:8080/api/log-files/second.txt")));
	    }

//	@Test
//	public void shouldStoreAndListAllFiles() throws Exception {
//
//		MockMultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain",
//				"Spring Framework".getBytes());
//		MockMultipartFile multipartFile2 = new MockMultipartFile("file", "test2.txt", "text/plain",
//				"Spring Framework".getBytes());
//		
//		storageService.store(multipartFile);
//		storageService.store(multipartFile2);
//
////        List<String> fileNames = storageService.loadAll().map(
////                path -> MvcUriComponentsBuilder.fromMethodName(FileUploadController.class,
////                        "getFile", path.getFileName().toString()).build().toString())
////                .collect(Collectors.toList());
//
////		given(this.storageService.loadAll()).willReturn(Stream.of(Paths.get("first.txt"), Paths.get("second.txt")));
//
//		mvc.perform(get("/api/log-files")).andExpect(status().isOk());
//		
////		.andExpect(model().attribute("files", Matchers
////				.contains("http://localhost/api/log-files/first.txt", "http://localhost/api/log-files/second.txt")));
//	}
//
//	@SuppressWarnings("unchecked")
//	@Test
//	public void should404WhenMissingFile() throws Exception {
//		given(this.storageService.loadAsResource("test.txt")).willThrow(StorageFileNotFoundException.class);
//
//		this.mvc.perform(get("/log-files/test.txt")).andExpect(status().isNotFound());
//	}
}
