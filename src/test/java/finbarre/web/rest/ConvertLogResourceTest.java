package finbarre.web.rest;

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
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ConvertLogResource REST controller.
 *
 * @see ConvertLogResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PassusApp.class)
public class ConvertLogResourceTest {

	private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);

	private static final String DEFAULT_NAME = "AAAAAAAAAA";

	private static final String DEFAULT_VALUE = "VVVVVVVVVVVV";
	private static final String UPDATED_VALUE = DEFAULT_VALUE + " [STATUS= CHECKED]";

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

	private MockMvc restPassusLogMockMvc;

	private PassusLog passusLog;

	@Before
	public void setup() {
		MockitoAnnotations.initMocks(this);
		final ConvertLogResource passusLogResource = new ConvertLogResource(passusLogService);
		this.restPassusLogMockMvc = MockMvcBuilders.standaloneSetup(passusLogResource)
				.setCustomArgumentResolvers(pageableArgumentResolver).setControllerAdvice(exceptionTranslator)
				.setConversionService(createFormattingConversionService()).setMessageConverters(jacksonMessageConverter)
				.build();
	}

	/**
	 * Create an entity for this test.
	 *
	 * This is a static method, as tests for other entities might also need it, if
	 * they test an entity which requires the current entity.
	 */
	public static PassusLog createEntity() {
		PassusLog passusLog = new PassusLog().time(DEFAULT_TIME).name(DEFAULT_NAME).value(DEFAULT_VALUE);
		return passusLog;
	}

	@Before
	public void initTest() {
		passusLogRepository.deleteAll();
		passusLog = createEntity();
	}

    @Test
    public void convertPassusLog() throws Exception {
        // Initialize the database
        passusLogService.save(passusLog);

        int databaseSizeBeforeUpdate = passusLogRepository.findAll().size();

        // Update the passusLog
        PassusLog updatedPassusLog = passusLogRepository.findById(passusLog.getId()).get();

        restPassusLogMockMvc.perform(put("/api/convert-log")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPassusLog)))
            .andExpect(status().isOk());

        // Validate the PassusLog in the database
        List<PassusLog> passusLogList = passusLogRepository.findAll();
        assertThat(passusLogList).hasSize(databaseSizeBeforeUpdate);
        PassusLog testPassusLog = passusLogList.get(passusLogList.size() - 1);
        assertThat(testPassusLog.getTime()).isEqualTo(DEFAULT_TIME);
        assertThat(testPassusLog.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPassusLog.getValue()).isEqualTo(UPDATED_VALUE);

        // again - remove status
        restPassusLogMockMvc.perform(put("/api/convert-log")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testPassusLog)))
            .andExpect(status().isOk());
        
        // Validate the PassusLog in the database
        passusLogList = passusLogRepository.findAll();
        assertThat(passusLogList).hasSize(databaseSizeBeforeUpdate);
        PassusLog testAgainPassusLog = passusLogList.get(passusLogList.size() - 1);
        assertThat(testAgainPassusLog.getTime()).isEqualTo(DEFAULT_TIME);
        assertThat(testAgainPassusLog.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAgainPassusLog.getValue()).isEqualTo(DEFAULT_VALUE);
    }
}
