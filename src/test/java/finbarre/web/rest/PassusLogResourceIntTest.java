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
@SpringBootTest(classes = PassusApp.class)
public class PassusLogResourceIntTest {

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

    private MockMvc restPassusLogMockMvc;

    private PassusLog passusLog;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PassusLogResource passusLogResource = new PassusLogResource(passusLogService);
        this.restPassusLogMockMvc = MockMvcBuilders.standaloneSetup(passusLogResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PassusLog createEntity() {
        PassusLog passusLog = new PassusLog()
            .time(DEFAULT_TIME)
            .name(DEFAULT_NAME)
            .value(DEFAULT_VALUE);
        return passusLog;
    }

    @Before
    public void initTest() {
        passusLogRepository.deleteAll();
        passusLog = createEntity();
    }

    @Test
    public void createPassusLog() throws Exception {
        int databaseSizeBeforeCreate = passusLogRepository.findAll().size();

        // Create the PassusLog
        restPassusLogMockMvc.perform(post("/api/passus-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(passusLog)))
            .andExpect(status().isCreated());

        // Validate the PassusLog in the database
        List<PassusLog> passusLogList = passusLogRepository.findAll();
        assertThat(passusLogList).hasSize(databaseSizeBeforeCreate + 1);
        PassusLog testPassusLog = passusLogList.get(passusLogList.size() - 1);
        assertThat(testPassusLog.getTime()).isEqualTo(DEFAULT_TIME);
        assertThat(testPassusLog.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPassusLog.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    public void createPassusLogWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = passusLogRepository.findAll().size();

        // Create the PassusLog with an existing ID
        passusLog.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restPassusLogMockMvc.perform(post("/api/passus-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(passusLog)))
            .andExpect(status().isBadRequest());

        // Validate the PassusLog in the database
        List<PassusLog> passusLogList = passusLogRepository.findAll();
        assertThat(passusLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = passusLogRepository.findAll().size();
        // set the field null
        passusLog.setTime(null);

        // Create the PassusLog, which fails.

        restPassusLogMockMvc.perform(post("/api/passus-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(passusLog)))
            .andExpect(status().isBadRequest());

        List<PassusLog> passusLogList = passusLogRepository.findAll();
        assertThat(passusLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllPassusLogs() throws Exception {
        // Initialize the database
        passusLogRepository.save(passusLog);

        // Get all the passusLogList
        restPassusLogMockMvc.perform(get("/api/passus-logs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(passusLog.getId())))
            .andExpect(jsonPath("$.[*].time").value(hasItem(sameInstant(DEFAULT_TIME))))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.toString())));
    }
    
    @Test
    public void getPassusLog() throws Exception {
        // Initialize the database
        passusLogRepository.save(passusLog);

        // Get the passusLog
        restPassusLogMockMvc.perform(get("/api/passus-logs/{id}", passusLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(passusLog.getId()))
            .andExpect(jsonPath("$.time").value(sameInstant(DEFAULT_TIME)))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.toString()));
    }

    @Test
    public void getNonExistingPassusLog() throws Exception {
        // Get the passusLog
        restPassusLogMockMvc.perform(get("/api/passus-logs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updatePassusLog() throws Exception {
        // Initialize the database
        passusLogService.save(passusLog);

        int databaseSizeBeforeUpdate = passusLogRepository.findAll().size();

        // Update the passusLog
        PassusLog updatedPassusLog = passusLogRepository.findById(passusLog.getId()).get();
        updatedPassusLog
            .time(UPDATED_TIME)
            .name(UPDATED_NAME)
            .value(UPDATED_VALUE);

        restPassusLogMockMvc.perform(put("/api/passus-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPassusLog)))
            .andExpect(status().isOk());

        // Validate the PassusLog in the database
        List<PassusLog> passusLogList = passusLogRepository.findAll();
        assertThat(passusLogList).hasSize(databaseSizeBeforeUpdate);
        PassusLog testPassusLog = passusLogList.get(passusLogList.size() - 1);
        assertThat(testPassusLog.getTime()).isEqualTo(UPDATED_TIME);
        assertThat(testPassusLog.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPassusLog.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    public void updateNonExistingPassusLog() throws Exception {
        int databaseSizeBeforeUpdate = passusLogRepository.findAll().size();

        // Create the PassusLog

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPassusLogMockMvc.perform(put("/api/passus-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(passusLog)))
            .andExpect(status().isBadRequest());

        // Validate the PassusLog in the database
        List<PassusLog> passusLogList = passusLogRepository.findAll();
        assertThat(passusLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    public void deletePassusLog() throws Exception {
        // Initialize the database
        passusLogService.save(passusLog);

        int databaseSizeBeforeDelete = passusLogRepository.findAll().size();

        // Get the passusLog
        restPassusLogMockMvc.perform(delete("/api/passus-logs/{id}", passusLog.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<PassusLog> passusLogList = passusLogRepository.findAll();
        assertThat(passusLogList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PassusLog.class);
        PassusLog passusLog1 = new PassusLog();
        passusLog1.setId("id1");
        PassusLog passusLog2 = new PassusLog();
        passusLog2.setId(passusLog1.getId());
        assertThat(passusLog1).isEqualTo(passusLog2);
        passusLog2.setId("id2");
        assertThat(passusLog1).isNotEqualTo(passusLog2);
        passusLog1.setId(null);
        assertThat(passusLog1).isNotEqualTo(passusLog2);
    }
}
